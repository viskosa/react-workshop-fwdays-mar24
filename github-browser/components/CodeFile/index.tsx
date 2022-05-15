import React, { useMemo } from 'react'
import { DocumentTextIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Link from 'next/link'

type CodeFileProps = {
  selectedRepo: string
  fileName: string
  fileType?: string
  fileSize: number
  content: string
  className?: string
}

export function CodeFile({
  fileName,
  fileType,
  fileSize,
  content,
  className,
  selectedRepo,
}: CodeFileProps) {
  const highlightedCode = useMemo(() => {
    return hljs.highlightAuto(content).value
  }, [content, fileType])

  const searchParams = new URLSearchParams()
  searchParams.set('selectedRepo', selectedRepo)
  searchParams.set('file', fileName)
  const tetrisLink = `/tetris?` + searchParams.toString()

  return (
    <div
      className={classNames(
        'overflow-hidden rounded border border-gray-200 bg-white',
        className,
      )}
    >
      <div className="grid items-center gap-4 bg-gray-50 px-8 py-4">
        <div className="flex items-center gap-4">
          <DocumentTextIcon className="h-6 w-6 text-gray-500" />
          <div className="space-y-1.5">
            <h2 className="text-base font-bold">{fileName}</h2>
            <p className="text-sm leading-none text-gray-500">
              {fileType ? <>{fileType} · </> : null}
              {(fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
          {fileType === 'text/markdown' && (
            <Link
              className="ml-auto rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              href={tetrisLink}
            >
              Tetris?
            </Link>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto px-8 py-4">
        <pre className="rounded-md text-sm">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
        </pre>
      </div>
    </div>
  )
}
