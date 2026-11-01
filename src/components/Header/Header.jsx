import {useEffect, useId, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'

import './Header.css'

const LOGO_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/InstaShare_Logo'

const Header = ({initialSearch = '', onSearch}) => {
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [suggestionResult, setSuggestionResult] = useState({
    query: '',
    items: [],
  })
  const [suggestionError, setSuggestionError] = useState({
    query: '',
    message: '',
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const suggestionsId = useId()
  const currentWord = searchValue.trim().split(/\s+/).pop() || ''
  const suggestions =
    suggestionResult.query === currentWord ? suggestionResult.items : []
  const currentSuggestionError =
    suggestionError.query === currentWord ? suggestionError.message : ''

  useEffect(() => {
    if (!currentWord) {
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      try {
        const jwtToken = Cookies.get('jwt_token')
        const response = await fetch(
          `https://apis.ccbp.in/insta-share/posts?search=${encodeURIComponent(
            currentWord,
          )}`,
          {
            method: 'GET',
            headers: {Authorization: `Bearer ${jwtToken}`},
            signal: controller.signal,
          },
        )
        if (!response.ok) {
          throw new Error('Unable to load search suggestions.')
        }

        const data = await response.json()
        const keywordMap = new Map()
        data.posts.forEach(post => {
          const caption = post.post_details?.caption || ''
          const words = caption.match(/[a-z0-9#_]+/gi) || []
          words.forEach(word => {
            if (word.toLowerCase().startsWith(currentWord.toLowerCase())) {
              keywordMap.set(word.toLowerCase(), word)
            }
          })
        })
        setSuggestionResult({
          query: currentWord,
          items: Array.from(keywordMap.values()).slice(0, 3),
        })
        setSuggestionError({query: currentWord, message: ''})
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestionResult({query: currentWord, items: []})
          setSuggestionError({
            query: currentWord,
            message: 'Suggestions are temporarily unavailable.',
          })
        }
      }
    }, 250)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [currentWord])

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  const onClickHome = () => {
    setSearchValue('')
    onSearch?.('')
    setMenuOpen(false)
  }

  const onClickSearch = () => {
    if (onSearch) {
      onSearch(searchValue)
    } else {
      navigate('/', {state: {search: searchValue}})
    }
    setMenuOpen(false)
  }

  const onSelectSuggestion = suggestion => {
    const lastWordStart = searchValue.lastIndexOf(currentWord)
    const selectedSearch = `${searchValue.slice(0, lastWordStart)}${suggestion}`
    setSearchValue(selectedSearch)
    if (onSearch) {
      onSearch(selectedSearch)
    } else {
      navigate('/', {state: {search: selectedSearch}})
    }
    setMenuOpen(false)
  }

  const onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      onClickSearch()
    }
  }

  return (
    <nav className="header-container">
      <div className="header-top-row">
        <Link to="/" className="header-logo-link" onClick={onClickHome}>
          <img src={LOGO_URL} alt="website logo" className="header-logo" />
          <h1 className="header-title">Insta Share</h1>
        </Link>
        <button
          type="button"
          className="header-menu-button"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <AiFillCloseCircle /> : <GiHamburgerMenu />}
        </button>
      </div>

      <div className={`header-menu ${menuOpen ? 'header-menu-open' : ''}`}>
        <div className="header-search-wrapper">
          <div className="header-search-container">
            <input
              type="search"
              className="header-search-input"
              placeholder="Search Caption"
              value={searchValue}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              aria-controls={suggestionsId}
              onChange={event => setSearchValue(event.target.value)}
              onKeyDown={onKeyDownSearch}
            />
            <button
              type="button"
              className="header-search-button"
              data-testid="searchIcon"
              onClick={onClickSearch}
            >
              <FaSearch />
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul
              className="header-search-suggestions"
              id={suggestionsId}
              aria-label="Search suggestions"
            >
              {suggestions.map(suggestion => (
                <li key={suggestion}>
                  <button
                    type="button"
                    className="header-search-suggestion"
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => onSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {currentSuggestionError && (
            <p className="header-search-error" role="status">
              {currentSuggestionError}
            </p>
          )}
        </div>

        <ul className="header-links">
          <li>
            <Link to="/" className="header-link" onClick={onClickHome}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/my-profile" className="header-link">
              Profile
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="header-logout-button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Header
