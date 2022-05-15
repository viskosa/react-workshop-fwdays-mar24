import { getUnzipDirectoryForRepo } from '@/lib/paths'
import { FileData, ResponseError } from '@/types'
import fs from 'fs/promises'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import mimeTypes from 'mime-types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileData | ResponseError>,
) {
  const { selectedRepo, file } = req.query

  if (!file) {
    res.status(400).json({ error: 'The file parameter is missing' })
    return
  }
  if (typeof file !== 'string') {
    res.status(400).json({ error: 'The file parameter is not a string' })
    return
  }
  if (!selectedRepo) {
    res.status(400).json({ error: 'The selectedRepo parameter is missing' })
    return
  }

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

  const selectedRepoName = selectedRepo.split('/')[1].toLowerCase()
  const unzipDir = getUnzipDirectoryForRepo(selectedRepoName)

  // Append the first directory to the path, as the zip archive contains a top-level directory that wraps the repo content
  const firstDirectory = (await fs.readdir(unzipDir))[0]
  const filePath = `${unzipDir}/${firstDirectory}/${file}`

  const content = await fs.readFile(filePath, 'utf8')
  const fileType = mimeTypes.lookup(path.extname(filePath)) || undefined
  const fileSize = (await fs.stat(filePath)).size

  const fileData: FileData = {
    file: {
      fileName: file,
      fileType,
      fileSize,
      content,
    },
  }

  res.status(200).json(fileData)
}
