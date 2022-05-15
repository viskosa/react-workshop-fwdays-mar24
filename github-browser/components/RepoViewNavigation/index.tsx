import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function RepoViewNavigation({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <>
      {page > 0 && (
        <button
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            const newSearchParams = new URLSearchParams(
              searchParams!.toString(),
            )
            newSearchParams.set('page', String(page - 1))
            router.push(`${pathname}?${newSearchParams!.toString()}`)
          }}
        >
          ← Prev
        </button>
      )}
      {page < totalPages - 1 && (
        <button
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            const newSearchParams = new URLSearchParams(
              searchParams!.toString(),
            )
            newSearchParams.set('page', String(page + 1))
            router.push(`${pathname}?${newSearchParams!.toString()}`)
          }}
        >
          Next →
        </button>
      )}
    </>
  )
}
