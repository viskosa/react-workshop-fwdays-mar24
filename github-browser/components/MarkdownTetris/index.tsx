import React, { Fragment, useEffect, useMemo } from 'react'
import { DocumentTextIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

type CodeFileProps = {
  fileName: string
  fileType?: string
  fileSize: number
  content: string
  className?: string
}

export function MarkdownTetris({
  fileName,
  fileType,
  fileSize,
  content,
  className,
}: CodeFileProps) {
  const [currentContent, setCurrentContent] = React.useState(
    content.split(/\n+/).filter(Boolean),
  )

  return (
    <div
      className={classNames(
        'overflow-hidden rounded border border-gray-200 bg-white',
        className,
      )}
    >
      <div className="grid items-center gap-4 bg-gray-50 px-8 py-4">
        <div className="flex items-center space-x-4">
          <DocumentTextIcon className="h-6 w-6 text-gray-500" />
          <div className="space-y-1.5">
            <h2 className="text-base font-bold">{fileName}</h2>
            <p className="text-sm leading-none text-gray-500">
              {fileType ? <>{fileType} · </> : null}
              {(fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto px-8 py-4">
        <div className="select-none rounded-md font-mono text-xs">
          {currentContent.map((line, lineIndex) => (
            <Line
              key={line + lineIndex}
              onDelete={() => {
                const newContent = [...currentContent]
                newContent.splice(lineIndex, 1)
                setCurrentContent(newContent)
              }}
              content={line}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type LineProps = {
  onDelete: () => void
  content: string
}

function Line({ onDelete, content }: LineProps) {
  const [currentContent, setCurrentContent] = React.useState(
    content.split(/\s+/).filter(Boolean),
  )

  useEffect(() => {
    if (currentContent.length === 0) {
      onDelete()
    }
  }, [currentContent, onDelete])

  return (
    <div className="my-0.5">
      {currentContent.map((word, wordIndex) => {
        return (
          <Fragment key={word + wordIndex}>
            <Word
              onDelete={() => {
                const newContent = [...currentContent]
                newContent.splice(wordIndex, 1)
                setCurrentContent(newContent)
              }}
              content={word}
            />{' '}
          </Fragment>
        )
      })}
    </div>
  )
}

type WordProps = {
  onDelete: () => void
  content: string
}

function Word({ onDelete, content }: WordProps) {
  return (
    <span
      className="inline-block cursor-pointer rounded-md bg-white transition-all hover:bg-red-300"
      onClick={onDelete}
    >
      {content}
    </span>
  )
}
