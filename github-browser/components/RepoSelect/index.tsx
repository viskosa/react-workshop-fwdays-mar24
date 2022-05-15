import { defaultRepo } from '@/consts'
import { useRouter, useSearchParams } from 'next/navigation'

export function RepoSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedRepo = searchParams!.get('selectedRepo') ?? defaultRepo

  return (
    <select
      className="block w-60 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={selectedRepo}
      onChange={(e) => {
        router.push(`/?selectedRepo=${e.target.value}`)
      }}
    >
      <option>microsoft/TypeScript</option>
      <option>facebook/react</option>
      <option>dai-shi/use-context-selector</option>
    </select>
  )
}
