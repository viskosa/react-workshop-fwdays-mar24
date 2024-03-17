import { Button } from '@mui/material'
import { useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { batch } from 'react-redux'
import fakeApi from '../../utils/fakeApi'
import NoteEditor from '../NoteEditor'
import NoteView from '../NoteView'
import DarkModeSwitcher from '../DarkModeSwitcher'
import ActiveAuthors from '../ActiveAuthors'
import spinner from './spinner.svg'
import './index.css'

function PrimaryPane({ activeNoteId, notes, saveNote }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [publishedAt, setPublishedAt] = useState(null)

  // const [state, setState] = useState({
  //   isLoading: false,
  //   isPublic: false,
  //   publishedAt: null,
  // })

  const togglePublic = async () => {
    setIsLoading(true)
    setIsPublic((isPublic) => !isPublic)
    // React 17: ↑↑ update 1
    // React 18: ↑↑ update 1

    if (isPublic) {
      await fakeApi.setPublicStatus(false)
      setIsLoading(false)
    } else {
      await fakeApi.setPublicStatus(true)
      const publishedDate = await fakeApi.getPublishedDate()
      // setState((state) => ({
      //   ...state,
      //   isLoading: false,
      //   publishedAt: publishedDate.toLocaleTimeString(),
      // }))
      unstable_batchedUpdates(() => {
        setIsLoading(false)
        setPublishedAt(publishedDate.toLocaleTimeString())
      })
      // React 17: ↑ update 2
    }

    // React 17: ↑ update 3
    // React 18: ↑↑ update 2
  }

  /*
  // React 17 and below do batching
  const updateQueue = []
  let updatesBatched = false

  setState = (newState) => {
    updateQueue.push({ newState })
    if (!updatesBatched) {
      processUpdateQueue()
    }
  }

  onClick = (fn) => {
    unstable_batchedUpdates(() => {
      fn()
    })
  }

  unstable_batchedUpdates = (fn) => {
    updatesBatched = true
    fn()
    updatesBatched = false
    processUpdateQueue()
  }

  // React 18 does batching
  const updateQueue = []

  setState = (newState) => {
    updateQueue.push({ newState })
    scheduleProcessUpdateQueue()
  }

  unstable_batchedUpdates = (fn) => fn()

  let scheduled = false
  scheduleProcessUpdateQueue = () => {
    if (!scheduled) {
      scheduled = true
      Promise.resolve().then(processUpdateQueue) // → like setTimeout(0), but in the end of the frame instead of the beginning of the next one
    }
  }

  processUpdateQueue = () => {
    scheduled = false
    // process updates
  }

  */

  if (!activeNoteId) {
    return (
      <div className="primary-pane__empty-editor">
        <div className="primary-pane__eyes">👀</div>
        <div className="primary-pane__eyes-caption">
          Select a note to start editing
        </div>
      </div>
    )
  }

  return (
    <div className="primary-pane">
      <div className="primary-pane__header">
        <h1 className="primary-pane__header-text">Editor</h1>
        <ActiveAuthors />
        <DarkModeSwitcher />
      </div>

      <div className="primary-pane__content">
        <div className="primary-pane__controls">
          <Button
            variant="outlined"
            onClick={togglePublic}
            disabled={isLoading}
            startIcon={isPublic ? '🤫' : '👀'}
          >
            {isLoading
              ? 'Loading...'
              : isPublic
              ? 'Make Private'
              : 'Make Public'}
          </Button>
          {!isLoading && isPublic && <span>Published at: {publishedAt}</span>}
        </div>
        <NoteEditor
          saveNote={({ text, date }) => saveNote(activeNoteId, { text, date })}
          notes={notes}
          activeNoteId={activeNoteId}
        />
        <div className="primary-pane__view">
          <NoteView text={notes[activeNoteId].text} />
        </div>
      </div>
      <div
        className={
          'primary-pane__spinner-wrapper' +
          (isLoading ? ' primary-pane__spinner-wrapper_visible' : '')
        }
      >
        <img className="primary-pane__spinner" src={spinner} alt="" />
      </div>
    </div>
  )
}

export default PrimaryPane
