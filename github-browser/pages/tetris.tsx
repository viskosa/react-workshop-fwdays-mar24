import { ErrorMessage } from '@/components/ErrorMessage'
import { MarkdownTetris } from '@/components/MarkdownTetris'
import { defaultRepo } from '@/consts'
import { File, FileData, ResponseError } from '@/types'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

export const getServerSideProps = (async (context) => {
  const selectedRepo = context.query.selectedRepo ?? defaultRepo
  const file = context.query.file

  if (typeof file !== 'string') {
    return { props: { error: '?file is missing or not a string' } }
  }

  const response = await fetch(
    process.env.FUNCTION_ORIGIN +
      `/api/file?selectedRepo=${selectedRepo}&file=${file}`,
  )

  const responseData: FileData | ResponseError = await response.json()
  if ('error' in responseData) {
    return { props: { error: responseData.error } }
  }

  return { props: { file: responseData.file } }
}) satisfies GetServerSideProps<{ file: File } | { error: string }>

export default function Tetris(props: { file: File } | { error: string }) {
  const router = useRouter()

  return (
    <main className="flex h-screen flex-col items-stretch ">
      <Head>
        <title>{`Tetris 🔲`}</title>
      </Head>
      <div className="mx-auto w-full max-w-7xl py-6 sm:px-6 lg:px-8">
        <nav className="my-4">
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => router.back()}
          >
            ← Go back
          </button>
        </nav>
        {'error' in props ? (
          <ErrorMessage error={props.error} />
        ) : (
          <MarkdownTetris
            fileName={props.file.fileName}
            fileType={props.file.fileType}
            fileSize={props.file.fileSize}
            content={props.file.content}
          />
        )}
      </div>
    </main>
  )
}
