import {useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './LoginForm.css'

const LOGIN_LANDING_IMAGE_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/LoginForm_Image'
const LOGO_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/InstaShare_Logo'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  const onSubmitSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    navigate('/', {replace: true})
  }

  const onSubmitFailure = message => {
    setShowSubmitError(true)
    setErrorMsg(message)
  }

  const onSubmitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch('https://apis.ccbp.in/login', options)
      const data = await response.json()
      if (response.ok === true) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      onSubmitFailure('Something went wrong. Please try again')
    }
  }

  return (
    <div className="login-container">
      <img
        src={LOGIN_LANDING_IMAGE_URL}
        alt="website login"
        className="login-landing-image"
      />
      <form className="login-form" onSubmit={onSubmitForm}>
        <img src={LOGO_URL} alt="website logo" className="login-logo" />
        <h1 className="login-app-name">Insta Share</h1>

        <div className="login-input-container">
          <label htmlFor="username" className="login-label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            className="login-input"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>

        <div className="login-input-container">
          <label htmlFor="password" className="login-label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>

        {showSubmitError && <p className="login-error-message">{errorMsg}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
