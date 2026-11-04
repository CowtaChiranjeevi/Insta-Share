
import {useState} from 'react'
import {createPortal} from 'react-dom'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import UserStoriesModal from '../UserStoriesModal/UserStoriesModal'
import PostModal from '../PostModal/PostModal'

import './Profile.css'

const FALLBACK_STORIES = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900',
]

const getRandomStory = () =>
  FALLBACK_STORIES[Math.floor(Math.random() * FALLBACK_STORIES.length)]

const Profile = ({profile, profileAlt, storyAlt, postAlt}) => {
  const {
    userId,
    userName,
    profilePic,
    followersCount,
    followingCount,
    userBio,
    postsCount,
    posts = [],
    stories = [],
  } = profile

  const [selectedStory, setSelectedStory] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)

  // Normalize profile posts so the modal receives a consistent structure.
  const formattedPosts = posts.map((post, index) => {
    const postDetails = post.post_details || {}

    const imageUrl =
      post.image ||
      post.image_url ||
      post.post_image_url ||
      post.imageUrl ||
      postDetails.image_url ||
      ''

    return {
      postId:
        post.postId ||
        post.post_id ||
        post.id ||
        `${userId}-post-${index}`,
      userId: post.user_id || userId,
      userName: post.user_name || userName,
      profilePic: post.profile_pic || profilePic,
      imageUrl,
      caption: post.caption || postDetails.caption || '',
      likesCount: Number(
        post.likesCount ?? post.likes_count ?? 0,
      ),
      createdAt: post.createdAt || post.created_at || '',
      comments: (post.comments || []).map(comment => ({
        userId: comment.userId || comment.user_id,
        userName: comment.userName || comment.user_name,
        comment: comment.comment || '',
      })),
    }
  })

  // Use a fallback story if the profile has no story images.
  const profileStories = stories.length > 0
    ? stories.map((story, index) => ({
        userId,
        userName,
        storyUrl:
          story.image ||
          story.story_url ||
          story.image_url ||
          getRandomStory(),
        id: story.id || `${userId}-${index}`,
      }))
    : [
        {
          userId,
          userName,
          storyUrl: getRandomStory(),
          id: `${userId}-fallback-story`,
        },
      ]

  const openStory = story => {
    setSelectedStory(story)
  }

  return (
    <div className="profile-container">
      <div className="profile-details">
        <button
          type="button"
          className="profile-picture-button profile-picture-with-story"
          aria-label={`View ${userName}'s story`}
          onClick={() => openStory(profileStories[0])}
        >
          <img
            src={profilePic}
            alt={profileAlt}
            className="profile-picture"
          />
        </button>

        <div className="profile-info">
          <h1 className="profile-name">{userName}</h1>

          <ul className="profile-stats">
            <li className="profile-stat">
              <p className="profile-stat-count">{postsCount}</p>
              <p className="profile-stat-label">posts</p>
            </li>
            <li className="profile-stat">
              <p className="profile-stat-count">{followersCount}</p>
              <p className="profile-stat-label">followers</p>
            </li>
            <li className="profile-stat">
              <p className="profile-stat-count">{followingCount}</p>
              <p className="profile-stat-label">following</p>
            </li>
          </ul>

          <p className="profile-user-id">{userId}</p>
          <p className="profile-bio">{userBio}</p>
        </div>
      </div>

      <ul className="profile-stories">
        {profileStories.map(story => (
          <li className="profile-story-item" key={story.id}>
            <button
              type="button"
              className="profile-story-button"
              aria-label={`View ${userName}'s highlight`}
              onClick={() => openStory(story)}
            >
              <img
                src={story.storyUrl}
                alt={storyAlt}
                className="profile-story-image"
              />
            </button>
          </li>
        ))}
      </ul>

      <hr className="profile-divider" />

      <div className="profile-posts-heading">
        <BsGrid3X3 />
        <h1 className="profile-posts-title">Posts</h1>
      </div>

      {formattedPosts.length > 0 ? (
        <ul className="profile-posts">
          {formattedPosts.map(post => (
            <li className="profile-post-item" key={post.postId}>
              <button
                type="button"
                className="profile-post-button"
                aria-label={`View post by ${userName}`}
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={postAlt}
                  className="profile-post-image"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="profile-no-posts">
          <div className="profile-no-posts-icon">
            <BiCamera size={40} />
          </div>
          <h1 className="profile-no-posts-heading">No Posts Yet</h1>
        </div>
      )}

      {selectedStory &&
        createPortal(
          <UserStoriesModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />,
          document.body,
        )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          profile={profile}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}

export default Profile
