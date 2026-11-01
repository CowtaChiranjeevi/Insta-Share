import {Link} from 'react-router-dom'

import './NotFound.css'

const NOT_FOUND_IMAGE_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/pgnotfound'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src={NOT_FOUND_IMAGE_URL}
      alt="page not found"
      className="not-found-image"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found. Please go back
      to the homepage.
    </p>
    <Link to="/">
      <button type="button" className="not-found-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
