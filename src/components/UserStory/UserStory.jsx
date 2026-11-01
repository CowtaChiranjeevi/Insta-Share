import {Link} from 'react-router-dom'

import './UserStory.css'

const UserStory = ({story, onSelect}) => {
  const {userId, userName, profilePic, storyUrl} = story

  return (
    <div className="user-story-item">
      <button
        type="button"
        className="user-story-button"
        aria-label={`View ${userName}'s story`}
        onClick={() => onSelect(story)}
      >
        <img
          src={profilePic || storyUrl}
          alt={`${userName} profile`}
          className="user-story-image"
        />
      </button>
      <Link to={`/users/${userId}`} className="user-story-name">
        {userName}
      </Link>
    </div>
  )
}

export default UserStory
