import { useState } from "react";

import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutlineOutlined,
  ShareOutlined,
  BookmarkBorderOutlined,
  MoreHoriz,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || []);

  const [liked, setLiked] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return false;

    return (post.likes || []).some(
      (like) =>
        like.userId.toString() === user.id.toString()
    );
  });

  const [comments, setComments] = useState(
    post.comments || []
  );

  const [commentText, setCommentText] = useState("");

  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const [showComments, setShowComments] = useState(false);

  const imageUrl = post.imageUrl
    ? `${API_URL}${post.imageUrl}`
    : null;

  const handleLike = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (likeLoading) return;

    setLikeLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${post._id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setLikes(result.likes);
      setLiked((current) => !current);
    } catch (error) {
      console.error("Like error:", error);
      alert("Something went wrong.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    if (commentLoading) return;

    setCommentLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setComments((current) => [
        ...current,
        result.comment,
      ]);

      setCommentText("");
      setShowComments(true);
    } catch (error) {
      console.error("Comment error:", error);
      alert("Something went wrong.");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="avatar post-avatar">
          {post.userId?.profilePicture ? (
            <img
              src={`${API_URL}${post.userId.profilePicture}`}
              alt={post.username || "Profile"}
            />
          ) : (
            post.username?.charAt(0).toUpperCase()
          )}
        </div>

        <div className="post-user">
          <strong>{post.username}</strong>

          <span>
            @{post.username
              ?.toLowerCase()
              .replace(/\s+/g, "")}
          </span>
        </div>

        <button className="more-button">
          <MoreHoriz />
        </button>
      </div>

      {post.text && (
        <p className="post-text">
          {post.text}
        </p>
      )}

      {imageUrl && (
        <div className="post-image">
          <img src={imageUrl} alt="Post" />
        </div>
      )}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={liked ? "liked" : ""}
          disabled={likeLoading}
        >
          {liked ? (
            <Favorite />
          ) : (
            <FavoriteBorder />
          )}

          <span>{likes.length}</span>
        </button>

        <button
          onClick={() =>
            setShowComments((current) => !current)
          }
        >
          <ChatBubbleOutlineOutlined />
          <span>{comments.length}</span>
        </button>

        <button>
          <ShareOutlined />
        </button>

        <button className="bookmark">
          <BookmarkBorderOutlined />
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form
            className="comment-form"
            onSubmit={handleComment}
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
            />

            <button
              type="submit"
              disabled={commentLoading}
            >
              {commentLoading ? "..." : "Send"}
            </button>
          </form>

          {comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div
                  className="comment-item"
                  key={comment._id}
                >
                  <div className="avatar small-avatar">
                    {comment.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="comment-content">
                    <strong>
                      {comment.username}
                    </strong>

                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default PostCard;