import { CodeFile } from '@/components/CodeFile'
import { Repo } from '@/types'

export function RepoView({
  repo,
  selectedRepo,
}: {
  repo: Repo
  selectedRepo: string
}) {
  return (
    <div className="columns-md gap-4">
      {repo.contents.map((content) => (
        <CodeFile
          key={content.fileName}
          selectedRepo={selectedRepo}
          fileName={content.fileName}
          fileType={content.fileType}
          fileSize={content.fileSize}
          content={content.content}
          className="mb-4 break-inside-avoid"
        />
      ))}
    </div>
  )
}
