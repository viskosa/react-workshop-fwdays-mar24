import path from 'path'
import os from 'os'

const unzipDirectoryCache: { [key: string]: string } = {}

export function getUnzipDirectoryForRepo(repoName: string) {
  if (!unzipDirectoryCache[repoName]) {
    unzipDirectoryCache[repoName] = path.join(os.tmpdir(), repoName)
  }
  return unzipDirectoryCache[repoName]
}
