import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'

import Header from '../Header/Header'
import Profile from '../Profile/Profile'
import FailureView from '../FailureView/FailureView'

import './MyProfile.css'

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const MyProfile = () => {
  const [status, setStatus] = useState(apiStatus.loading)
  const [profile, setProfile] = useState(null)

  const getMyProfile = useCallback(async () => {
    setStatus(apiStatus.loading)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(
        'https://apis.ccbp.in/insta-share/my-profile',
        options,
      )
      if (response.ok === true) {
        const data = await response.json()
        const each = data.profile
        setProfile({
          userId: each.user_id,
          userName: each.user_name,
          profilePic: each.profile_pic,
          followersCount: each.followers_count,
          followingCount: each.following_count,
          userBio: each.user_bio,
          postsCount: each.posts_count,
          posts: each.posts,
          stories: each.stories,
        })
        setStatus(apiStatus.success)
      } else {
        setStatus(apiStatus.failure)
      }
    } catch (error) {
      setStatus(apiStatus.failure)
    }
  }, [])

  useEffect(() => {
    getMyProfile()
  }, [getMyProfile])

  const renderContent = () => {
    switch (status) {
      case apiStatus.loading:
        return (
          <div className="my-profile-loader-container" data-testid="loader">
            <TailSpin color="#4094EF" height={40} width={40} />
          </div>
        )
      case apiStatus.failure:
        return <FailureView onRetry={getMyProfile} />
      default:
        return (
          <Profile
            profile={profile}
            profileAlt="my profile"
            storyAlt="my story"
            postAlt="my post"
          />
        )
    }
  }

  return (
    <div className="my-profile-page">
      <Header />
      {renderContent()}
    </div>
  )
}

export default MyProfile
