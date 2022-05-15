import { Repo, RepoData, ResponseError } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import mimeTypes from 'mime-types'
import unzipper from 'unzipper'
import { getUnzipDirectoryForRepo } from '@/lib/paths'

const readDirRecursivelyUncached = (dir: string, fileList: string[] = []) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.lstatSync(filePath)
    if (stat.isDirectory()) {
      fileList = readDirRecursivelyUncached(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  })
  return fileList
}

const readDirCache: { [key: string]: string[] } = {}
const readDirRecursively = (dir: string) => {
  if (!readDirCache[dir]) {
    // Cache the result: we assume the list of files in the uncached directory won’t change during the lifetime of the app
    readDirCache[dir] = readDirRecursivelyUncached(dir)
  }
  return readDirCache[dir]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RepoData | ResponseError>,
) {
  const {
    selectedRepo,
    page: pageAsString,
    pageSize: pageSizeAsString,
  } = req.query
  if (!pageAsString) {
    res.status(400).json({ error: 'The page parameter is missing' })
    return
  }
  if (!pageSizeAsString) {
    res.status(400).json({ error: 'The pageSize parameter is missing' })
    return
  }
  if (!selectedRepo) {
    res.status(400).json({ error: 'The selectedRepo parameter is missing' })
    return
  }
  const page = Number(pageAsString)
  const pageSize = Number(pageSizeAsString)

  // Return a 400 if the selectedRepo is not one of: dai-shi/use-context-selector, facebook/react, microsoft/TypeScript
  if (
    selectedRepo !== 'dai-shi/use-context-selector' &&
    selectedRepo !== 'facebook/react' &&
    selectedRepo !== 'microsoft/TypeScript'
  ) {
    res.status(400).json({
      error:
        'Invalid repository. Please select one of: dai-shi/use-context-selector, facebook/react, microsoft/TypeScript',
    })
    return
  }

  // Check if the directory exists, if not, unpack the zip file
  const selectedRepoName = selectedRepo.split('/')[1].toLowerCase()
  const unzipDir = getUnzipDirectoryForRepo(selectedRepoName)
  if (!fs.existsSync(unzipDir)) {
    console.log(`Unzipping the ${selectedRepoName} repo into ${unzipDir}...`)
    fs.mkdirSync(unzipDir, { recursive: true })
    await new Promise((resolve, reject) => {
      fs.createReadStream(
        path.resolve(process.cwd(), `repos/${selectedRepoName}.zip`),
      )
        .pipe(unzipper.Extract({ path: unzipDir }))
        .on('close', resolve)
        .on('error', reject)
    })
    console.log('Done unzipping')
  }

  // Get the list of all files in the unzipped directory
  const fileList = readDirRecursively(unzipDir)

  // Initialize the repo object
  const repo: Repo = {
    name: selectedRepo,
    contents: [],
  }

  // Paginate the repo contents
  const start = page * pageSize
  const end = start + pageSize
  const paginatedContents = fileList.slice(start, end)

  // Read the contents of each file and add it to the repo object
  for (const file of paginatedContents) {
    const content = fs.readFileSync(file, 'utf8')
    const fileName = path
      .relative(unzipDir, file)
      // Drop the first directory in the path, as the zip archive contains a top-level directory that wraps the repo content
      .split(path.sep)
      .slice(1)
      .join(path.sep)
    const fileType = mimeTypes.lookup(path.extname(file)) || undefined
    const fileSize = fs.statSync(file).size
    repo.contents.push({
      fileName,
      fileType,
      fileSize,
      content,
    })
  }

  // Return the repo object with pagination
  res.status(200).json({
    repo,
    page,
    totalPages: Math.ceil(fileList.length / pageSize),
  })
}
