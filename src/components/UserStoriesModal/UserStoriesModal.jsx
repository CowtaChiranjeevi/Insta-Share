import {useEffect} from 'react'
import {AiOutlineClose} from 'react-icons/ai'

import './UserStoriesModal.css'

const UserStoriesModal = ({story, onClose}) => {
  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const {userName, storyUrl} = story

  return (
    <div
      className="stories-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${userName} story`}
      onClick={onClose}
    >
      <div
        className="stories-modal-content"
        onClick={event => event.stopPropagation()}
      >
        <div className="stories-modal-header">
          <p className="stories-modal-name">{userName}</p>
          <button
            type="button"
            className="stories-modal-close"
            aria-label="Close story"
            onClick={onClose}
          >
            <AiOutlineClose />
          </button>
        </div>
        <img src={storyUrl} alt="story view" className="stories-modal-image" />
      </div>
    </div>
  )
}

export default UserStoriesModal
