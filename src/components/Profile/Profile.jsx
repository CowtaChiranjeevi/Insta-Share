import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import {useState} from 'react'
import UserStoriesModal from '../UserStoriesModal/UserStoriesModal'

import './Profile.css'

const Profile = ({profile, profileAlt, storyAlt, postAlt}) => {
  const {
    userId,
    userName,
    profilePic,
    followersCount,
    followingCount,
    userBio,
    postsCount,
    posts,
    stories,
  } = profile
  const [selectedStory, setSelectedStory] = useState(null)
  const profileStories = (stories || [])
    .map((story, index) => ({
      userId,
      userName,
      storyUrl: story.image || story.story_url,
      id: story.id || `${userId}-${index}`,
    }))
    .filter(story => story.storyUrl)
  const hasStories = profileStories.length > 0

  return (
    <div className="profile-container">
      <div className="profile-details">
        {hasStories ? (
          <button
            type="button"
            className="profile-picture-button profile-picture-with-story"
            aria-label={`View ${userName}'s story`}
            onClick={() => setSelectedStory(profileStories[0])}
          >
            <img src={profilePic} alt={profileAlt} className="profile-picture" />
          </button>
        ) : (
          <img src={profilePic} alt={profileAlt} className="profile-picture" />
        )}

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
            <img
              src={story.storyUrl}
              alt={storyAlt}
              className="profile-story-image"
            />
          </li>
        ))}
      </ul>

      <hr className="profile-divider" />

      <div className="profile-posts-heading">
        <BsGrid3X3 />
        <h1 className="profile-posts-title">Posts</h1>
      </div>

      {posts.length > 0 ? (
        <ul className="profile-posts">
          {posts.map(post => (
            <li className="profile-post-item" key={post.id}>
              <img
                src={post.image}
                alt={postAlt}
                className="profile-post-image"
              />
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
      {selectedStory && (
        <UserStoriesModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  )
}

export default Profile
