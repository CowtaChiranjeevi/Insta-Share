import './FailureView.css'

const FAILURE_IMAGE_URL = 'https://res.cloudinary.com/nwy3zyh4/image/upload/f_auto,q_auto/SmthngWentWrng'

const FailureView = ({onRetry}) => (
  <div className="failure-view-container">
    <img
      src={FAILURE_IMAGE_URL}
      alt="failure view"
      className="failure-view-image"
    />
    <p className="failure-view-text">Something went wrong. Please try again</p>
    <button type="button" className="failure-view-button" onClick={onRetry}>
      Try again
    </button>
  </div>
)

export default FailureView
