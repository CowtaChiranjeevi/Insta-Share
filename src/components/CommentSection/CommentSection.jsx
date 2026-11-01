import './CommentSection.css'

const CommentSection = ({comments}) => (
  <ul className="comments-list">
    {comments.map(comment => (
      <li className="comment-item" key={`${comment.userId}-${comment.comment}`}>
        <p className="comment-text">
          <span className="comment-user-name">{comment.userName}</span>
          {comment.comment}
        </p>
      </li>
    ))}
  </ul>
)

export default CommentSection
