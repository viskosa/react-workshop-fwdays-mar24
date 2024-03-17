import { CodeFile } from '@/components/CodeFile'
import { Repo } from '@/types'
import { Suspense, useEffect } from 'react'
import LazyHydrate from 'react-lazy-hydration'

// let hasHydrated = false

// const LazyHydrate = ({ children }: any) => {
//   const isClient = typeof window !== 'undefined'

//   if (!isClient || hasHydrated) {
//     return <div>{children}</div>
//   }

//   useEffect(() => {
//     hasHydrated = true
//   }, [])

//   return (
//     <div
//       dangerouslySetInnerHTML={{ __html: '' }}
//       suppressHydrationWarning
//     ></div>
//   )
// }

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
        // <LazyHydrate key={content.fileName} whenVisible>
        // ssrOnly
        // whenIdle → split hydration into chunks
        // whenVisible → only hydrates the visible items
        <Suspense>
          <CodeFile
            key={content.fileName}
            selectedRepo={selectedRepo}
            fileName={content.fileName}
            fileType={content.fileType}
            fileSize={content.fileSize}
            content={content.content}
            className="mb-4 break-inside-avoid"
          />
        </Suspense>
        // </LazyHydrate>
      ))}
    </div>
  )
}
