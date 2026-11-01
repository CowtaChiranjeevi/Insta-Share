import {useState} from 'react'
import {createPortal} from 'react-dom'
import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import PostActions from '../PostActions/PostActions'
import CommentSection from '../CommentSection/CommentSection'
import UserStoriesModal from '../UserStoriesModal/UserStoriesModal'

import './Post.css'

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

const Post = ({post}) => {
  const {
    postId,
    userId,
    userName,
    profilePic,
    imageUrl,
    caption,
    comments,
    createdAt,
  } = post
  const shareUrl = new URL(window.location.href)
  shareUrl.hash = `post-${postId}`

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [postComments, setPostComments] = useState(comments)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [selectedStory, setSelectedStory] = useState(null)
  const [isLoadingStory, setIsLoadingStory] = useState(false)
  const [storyError, setStoryError] = useState('')
  const navigate = useNavigate()

  const onClickProfilePicture = async () => {
    if (isLoadingStory) {
      return
    }

    setIsLoadingStory(true)
    setStoryError('')
    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('You must be logged in to view stories.')
      }

      const response = await fetch(
        `https://apis.ccbp.in/insta-share/users/${userId}`,
        {headers: {Authorization: `Bearer ${jwtToken}`}},
      )
      if (!response.ok) {
        throw new Error('Unable to load this user\'s story.')
      }

      const data = await response.json()
      const user = data.user_details
      const story = (user.stories || [])
        .map((item, index) => ({
          id: item.id || `${userId}-${index}`,
          userId,
          userName,
          storyUrl: item.image || item.story_url,
        }))
        .find(item => item.storyUrl)

      if (story) {
        setSelectedStory(story)
      } else {
        navigate(`/users/${userId}`)
      }
    } catch (error) {
      setStoryError(error.message || 'Unable to load this user\'s story.')
    } finally {
      setIsLoadingStory(false)
    }
  }

  const onToggleLike = async () => {
    const newStatus = !isLiked
    // Update the UI right away; the API only returns a mock response
    setIsLiked(newStatus)
    setLikesCount(prev => (newStatus ? prev + 1 : prev - 1))

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      headers: {Authorization: `Bearer ${jwtToken}`},
      body: JSON.stringify({like_status: newStatus}),
    }

    try {
      await fetch(
        `https://apis.ccbp.in/insta-share/posts/${postId}/like`,
        options,
      )
    } catch (error) {
      // Like state is not persisted by the server, so nothing else to do
    }
  }

  const onAddComment = async () => {
    if (isAddingComment) {
      return
    }

    setIsAddingComment(true)
    setCommentError('')

    try {
      const jwtToken = Cookies.get('jwt_token')
      if (!jwtToken) {
        throw new Error('You must be logged in to comment.')
      }

      let commenter = currentUser
      if (!commenter) {
        const profileResponse = await fetch(
          'https://apis.ccbp.in/insta-share/my-profile',
          {
            method: 'GET',
            headers: {Authorization: `Bearer ${jwtToken}`},
          },
        )
        if (!profileResponse.ok) {
          throw new Error('Unable to load your profile.')
        }

        const profileData = await profileResponse.json()
        const profile = profileData.profile
        if (!profile?.user_id || !profile?.user_name) {
          throw new Error('Your profile is missing comment details.')
        }

        commenter = {
          userId: profile.user_id,
          userName: profile.user_name,
        }
        setCurrentUser(commenter)
      }

      const comment =
        POSITIVE_COMMENTS[Math.floor(Math.random() * POSITIVE_COMMENTS.length)]
      setPostComments(previousComments => [
        ...previousComments,
        {userId: commenter.userId, userName: commenter.userName, comment},
      ])
    } catch (error) {
      setCommentError(
        error.message === 'Failed to fetch'
          ? 'Unable to load your account details. Please try again.'
          : error.message || 'Unable to add your comment.',
      )
    } finally {
      setIsAddingComment(false)
    }
  }

  return (
    <li id={`post-${postId}`} className="post-item" data-testid="postItem">
      <div className="post-header">
        <button
          type="button"
          className="post-author-story-button"
          aria-label={`View ${userName}'s story`}
          title={isLoadingStory ? 'Loading story' : `View ${userName}'s story`}
          onClick={onClickProfilePicture}
          disabled={isLoadingStory}
        >
          <img
            src={profilePic}
            alt="post author profile"
            className="post-author-image"
          />
        </button>
        <Link to={`/users/${userId}`} className="post-author-link">
          {userName}
        </Link>
      </div>

      <img src={imageUrl} alt="post" className="post-image" />

      <div className="post-body">
        <PostActions
          isLiked={isLiked}
          onToggleLike={onToggleLike}
          onAddComment={onAddComment}
          isAddingComment={isAddingComment}
          shareUrl={shareUrl.toString()}
          shareText={caption || ''}
        />
        <p className="post-likes">{likesCount} likes</p>
        <p className="post-caption">{caption}</p>
        <CommentSection comments={postComments} />
        {commentError && (
          <p className="post-comment-error" role="alert">
            {commentError}
          </p>
        )}
        {storyError && (
          <p className="post-comment-error" role="alert">
            {storyError}
          </p>
        )}
        <p className="post-created-at">{createdAt}</p>
      </div>
      {selectedStory &&
        createPortal(
          <UserStoriesModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />,
          document.body,
        )}
    </li>
  )
}

export default Post
