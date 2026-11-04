
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {AiOutlineClose} from 'react-icons/ai'
import Cookies from 'js-cookie'

import PostActions from '../PostActions/PostActions'
import CommentSection from '../CommentSection/CommentSection'

import './PostModal.css'

const POSITIVE_COMMENTS = [
  'This is so lovely!',
  'Absolutely beautiful!',
  'Love this so much!',
  'What a wonderful moment!',
  'This made me smile!',
  'Such a great shot!',
  'So amazing!',
  'Love the vibes here!',
  'This is pure happiness!',
  'You captured this perfectly!',
]

const PostModal = ({post, profile, onClose}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [comments, setComments] = useState(post.comments)
  const [commentText, setCommentText] = useState('')
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const shareUrl = new URL(window.location.href)
  shareUrl.hash = `post-${post.postId}`

  const onToggleLike = async () => {
    const newStatus = !isLiked

    setIsLiked(newStatus)
    setLikesCount(previous => (
      newStatus ? previous + 1 : Math.max(0, previous - 1)
    ))

    const jwtToken = Cookies.get('jwt_token')

    try {
      await fetch(
        `https://apis.ccbp.in/insta-share/posts/${post.postId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({like_status: newStatus}),
        },
      )
    } catch (error) {
      // Likes are not persisted by the practice API.
    }
  }

  const getCurrentUser = async () => {
    if (currentUser) {
      return currentUser
    }

    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch(
      'https://apis.ccbp.in/insta-share/my-profile',
      {
        headers: {Authorization: `Bearer ${jwtToken}`},
      },
    )

    if (!response.ok) {
      throw new Error('Unable to load your account details.')
    }

    const data = await response.json()

    const user = {
      userId: data.profile.user_id,
      userName: data.profile.user_name,
    }

    setCurrentUser(user)
    return user
  }

  const onAddComment = async event => {
    event.preventDefault()

    const text = commentText.trim()

    if (!text || isAddingComment) {
      return
    }

    setIsAddingComment(true)
    setCommentError('')

    try {
      const user = await getCurrentUser()

      setComments(previous => [
        ...previous,
        {
          userId: user.userId,
          userName: user.userName,
          comment: text,
        },
      ])

      setCommentText('')
    } catch (error) {
      setCommentError(error.message || 'Unable to add comment.')
    } finally {
      setIsAddingComment(false)
    }
  }

  const onQuickComment = async () => {
    setCommentError('')

    try {
      const user = await getCurrentUser()
      const comment = POSITIVE_COMMENTS[
        Math.floor(Math.random() * POSITIVE_COMMENTS.length)
      ]

      setComments(previous => [
        ...previous,
        {
          userId: user.userId,
          userName: user.userName,
          comment,
        },
      ])
    } catch (error) {
      setCommentError(error.message || 'Unable to add comment.')
    }
  }

  return createPortal(
    <div
      className="post-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Post details"
      onClick={onClose}
    >
      <div
        className="post-modal-content"
        onClick={event => event.stopPropagation()}
      >
        <button
          type="button"
          className="post-modal-close"
          aria-label="Close post"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="post-modal-image-container">
          <img
            src={post.imageUrl}
            alt="Selected post"
            className="post-modal-image"
          />
        </div>

        <div className="post-modal-details">
          <div className="post-modal-header">
            <img
              src={profile.profilePic}
              alt="Profile"
              className="post-modal-avatar"
            />
            <div>
              <p className="post-modal-username">{profile.userName}</p>
              <p className="post-modal-location">{profile.userId}</p>
            </div>
          </div>

          <div className="post-modal-caption">
            <img
              src={profile.profilePic}
              alt=""
              className="post-modal-avatar"
            />
            <p>
              <strong>{profile.userName}</strong> {post.caption}
            </p>
          </div>

          <div className="post-modal-comments">
            <CommentSection comments={comments} />
          </div>

          <div className="post-modal-bottom">
            <PostActions
              isLiked={isLiked}
              onToggleLike={onToggleLike}
              onAddComment={onQuickComment}
              isAddingComment={isAddingComment}
              shareUrl={shareUrl.toString()}
              shareText={post.caption || ''}
            />

            <p className="post-modal-likes">{likesCount} likes</p>

            <p className="post-modal-date">{post.createdAt}</p>

            <form className="post-modal-comment-form" onSubmit={onAddComment}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={event => setCommentText(event.target.value)}
                aria-label="Write a comment"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isAddingComment}
              >
                {isAddingComment ? 'Posting...' : 'Post'}
              </button>
            </form>

            {commentError && (
              <p className="post-modal-error" role="alert">
                {commentError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default PostModal
