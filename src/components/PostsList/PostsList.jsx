import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'

import Post from '../Post/Post'
import FailureView from '../FailureView/FailureView'

import './PostsList.css'

const SEARCH_NOT_FOUND_IMAGE_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/SearchNotFound'

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const PostsList = ({searchInput = ''}) => {
  const [status, setStatus] = useState(apiStatus.loading)
  const [posts, setPosts] = useState([])

  const getPosts = useCallback(async () => {
    setStatus(apiStatus.loading)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${encodeURIComponent(
      searchInput,
    )}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(url, options)
      if (response.ok === true) {
        const data = await response.json()
        const formatted = data.posts.map(each => ({
          postId: each.post_id,
          userId: each.user_id,
          userName: each.user_name,
          profilePic: each.profile_pic,
          imageUrl: each.post_details.image_url,
          caption: each.post_details.caption,
          likesCount: each.likes_count,
          createdAt: each.created_at,
          comments: (each.comments || []).map(comment => ({
            userId: comment.user_id,
            userName: comment.user_name,
            comment: comment.comment,
          })),
        }))
        setPosts(formatted)
        setStatus(apiStatus.success)
      } else {
        setStatus(apiStatus.failure)
      }
    } catch (error) {
      setStatus(apiStatus.failure)
    }
  }, [searchInput])

  useEffect(() => {
    getPosts()
  }, [getPosts])

  const renderSuccess = () => {
    if (posts.length === 0) {
      return (
        <div className="posts-not-found-container">
          <img
            src={SEARCH_NOT_FOUND_IMAGE_URL}
            alt="search not found"
            className="posts-not-found-image"
          />
          <h1 className="posts-not-found-heading">Search Not Found</h1>
          <p className="posts-not-found-text">
            Try different keyword or search again
          </p>
        </div>
      )
    }

    return (
      <>
        {searchInput !== '' && (
          <h1 className="posts-search-heading">Search Results</h1>
        )}
        <ul className="posts-list">
          {posts.map(post => (
            <Post key={post.postId} post={post} />
          ))}
        </ul>
      </>
    )
  }

  switch (status) {
    case apiStatus.loading:
      return (
        <div className="posts-loader-container" data-testid="loader">
          <TailSpin color="#4094EF" height={40} width={40} />
        </div>
      )
    case apiStatus.failure:
      return <FailureView onRetry={getPosts} />
    default:
      return renderSuccess()
  }
}

export default PostsList
