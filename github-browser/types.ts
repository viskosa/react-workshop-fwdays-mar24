export type File = {
  fileName: string
  fileType?: string
  fileSize: number
  content: string
}

export type Repo = {
  name: string
  contents: File[]
}

export type RepoData = { repo: Repo; page: number; totalPages: number }

export type FileData = { file: File }

export type ResponseError = {
  error: string
}
