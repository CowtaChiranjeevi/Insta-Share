import {useId, useState} from 'react'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {
  FaFacebookF,
  FaLinkedinIn,
  FaRegComment,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './PostActions.css'

const PostActions = ({
  isLiked,
  onToggleLike,
  onAddComment,
  isAddingComment,
  shareUrl,
  shareText,
}) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const shareMenuId = useId()
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(shareText)
  const shareOptions = [
    {
      label: 'Facebook',
      icon: <FaFacebookF />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: <FaTwitter />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      label: 'WhatsApp',
      icon: <FaWhatsapp />,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      label: 'LinkedIn',
      icon: <FaLinkedinIn />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Telegram',
      icon: <FaTelegramPlane />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
  ]

  return (
    <div className="post-actions">
      {isLiked ? (
        <button
          type="button"
          className="post-action-button"
          data-testid="unLikeIcon"
          aria-label="Unlike"
          onClick={onToggleLike}
        >
          <FcLike size={22} />
        </button>
      ) : (
        <button
          type="button"
          className="post-action-button"
          data-testid="likeIcon"
          aria-label="Like"
          onClick={onToggleLike}
        >
          <BsHeart size={20} />
        </button>
      )}
      <button
        type="button"
        className="post-action-button"
        aria-label="Comment"
        title="Add a positive comment"
        onClick={onAddComment}
        disabled={isAddingComment}
      >
        <FaRegComment size={20} />
      </button>
      <div className="post-share-container">
        <button
          type="button"
          className="post-action-button"
          aria-label="Share"
          aria-expanded={isShareMenuOpen}
          aria-controls={shareMenuId}
          onClick={() => setIsShareMenuOpen(isOpen => !isOpen)}
        >
          <BiShareAlt size={22} />
        </button>
        {isShareMenuOpen && (
          <div
            className="post-share-menu"
            id={shareMenuId}
            aria-label="Share this post"
          >
            {shareOptions.map(option => (
              <a
                className="post-share-link"
                href={option.href}
                key={option.label}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareMenuOpen(false)}
              >
                {option.icon}
                <span>{option.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostActions
