import { Repo, RepoData, ResponseError } from '@/types'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ErrorMessage } from '../components/ErrorMessage'
import { RepoView } from '../components/RepoView'
import { defaultRepo } from '../consts'
import { RepoViewNavigation } from '@/components/RepoViewNavigation'
import { RepoSelect } from '@/components/RepoSelect'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const selectedRepo = String(searchParams.selectedRepo ?? defaultRepo)
  const page = Number(searchParams.page ?? 0)
  const pageSize = Number(searchParams.pageSize ?? 10)

  const response = await fetch(
    process.env.FUNCTION_ORIGIN +
      `/api/repo?selectedRepo=${selectedRepo}&page=${page}&pageSize=${pageSize}`,
  )

  const responseData: RepoData | ResponseError = await response.json()

  return (
    <main className="flex h-screen flex-col items-stretch bg-gray-100">
      <Head>
        <title>GitHub Browser</title>
      </Head>
      <nav className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <RepoSelect />
          </div>
        </div>
      </nav>

      <header className="relative z-10 bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {selectedRepo}
          </h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl overflow-auto py-6 sm:px-6 lg:px-8">
        {'error' in responseData ? (
          <ErrorMessage error={responseData.error} />
        ) : (
          <>
            <RepoView repo={responseData.repo} selectedRepo={selectedRepo} />
            <div className="mt-4 flex gap-4">
              <RepoViewNavigation
                page={responseData.page}
                totalPages={responseData.totalPages}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
