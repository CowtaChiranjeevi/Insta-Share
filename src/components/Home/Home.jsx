import {useState} from 'react'
import {useLocation} from 'react-router-dom'

import Header from '../Header/Header'
import UserStories from '../UserStories/UserStories'
import PostsList from '../PostsList/PostsList'

import './Home.css'

const Home = () => {
  const location = useLocation()
  // When the search is started from another route, Header passes the text
  // through the router location state.
  const [searchInput, setSearchInput] = useState(location.state?.search || '')

  return (
    <div className="home-container">
      <Header initialSearch={searchInput} onSearch={setSearchInput} />
      <div className="home-content">
        {searchInput === '' && <UserStories />}
        <PostsList searchInput={searchInput} />
      </div>
    </div>
  )
}

export default Home
