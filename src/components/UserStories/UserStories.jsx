import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import SliderModule from 'react-slick'
import {TailSpin} from 'react-loader-spinner'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import UserStory from '../UserStory/UserStory'
import UserStoriesModal from '../UserStoriesModal/UserStoriesModal'
import FailureView from '../FailureView/FailureView'

import './UserStories.css'

const Slider = SliderModule.default

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 400,
  slidesToShow: 7,
  slidesToScroll: 3,
  responsive: [
    {breakpoint: 1024, settings: {slidesToShow: 6, slidesToScroll: 3}},
    {breakpoint: 768, settings: {slidesToShow: 5, slidesToScroll: 2}},
    {breakpoint: 576, settings: {slidesToShow: 4, slidesToScroll: 2}},
  ],
}

const UserStories = () => {
  const [status, setStatus] = useState(apiStatus.loading)
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)

  const getStories = useCallback(async () => {
    setStatus(apiStatus.loading)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(
        'https://apis.ccbp.in/insta-share/stories',
        options,
      )
      if (response.ok === true) {
        const data = await response.json()
        const formatted = data.users_stories.map(each => ({
          userId: each.user_id,
          userName: each.user_name,
          profilePic: each.profile_pic || each.profile_pic_url,
          storyUrl: each.story_url,
        }))
        setStories(formatted)
        setStatus(apiStatus.success)
      } else {
        setStatus(apiStatus.failure)
      }
    } catch (error) {
      setStatus(apiStatus.failure)
    }
  }, [])

  useEffect(() => {
    getStories()
  }, [getStories])

  const closeModal = useCallback(() => setSelectedStory(null), [])

  const renderContent = () => {
    switch (status) {
      case apiStatus.loading:
        return (
          <div className="stories-loader-container" data-testid="loader">
            <TailSpin color="#4094EF" height={40} width={40} />
          </div>
        )
      case apiStatus.failure:
        return <FailureView onRetry={getStories} />
      default:
        return (
          <Slider {...sliderSettings}>
            {stories.map(story => (
              <UserStory
                key={story.userId}
                story={story}
                onSelect={setSelectedStory}
              />
            ))}
          </Slider>
        )
    }
  }

  return (
    <div className="user-stories-container">
      {renderContent()}
      {selectedStory && (
        <UserStoriesModal story={selectedStory} onClose={closeModal} />
      )}
    </div>
  )
}

export default UserStories
