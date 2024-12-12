import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import MDEditor from "@uiw/react-md-editor";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPost(data);
      setEditedTitle(data.title);
      // Corrected property name from 'nd' to match backend
      setEditedContent(data.nd || "");
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: id,
            userId: user.id,
            content: newComment,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");
      const newCommentData = await response.json();
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.nd || "");
  };

  const handleSaveEdit = async () => {
    try {
      // Prepare form data to handle potential image upload
      const formData = new FormData();
      formData.append("title", editedTitle);
      formData.append("nd", editedContent);
      formData.append("authorId", user.id);

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        body: formData, // Using FormData to support potential file uploads
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi cập nhật bài viết");
      }

      const updatedPost = await response.json();
      setPost(updatedPost.post);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      setError(error.message || "Lỗi khi cập nhật bài viết");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorId: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi xóa bài viết");
        }

        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        setError(error.message || "Lỗi khi xóa bài viết");
      }
    }
  };

  const isAuthor = user && post && user.id === post.authorId;

  return (
    <div className="post-detail-container">
      <header className="post-detail-header">
        <div className="header-content">
          <Link to="/" className="back-button">
            Trở về trang chủ
          </Link>
        </div>
      </header>

      <main className="post-detail-main">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : post ? (
          <article className="post-detail-content">
            {isEditing ? (
              // Form chỉnh sửa
              <div className="edit-form">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="edit-title-input"
                  placeholder="Tiêu đề bài viết"
                />
                <div data-color-mode="light">
                  <MDEditor
                    value={editedContent}
                    onChange={setEditedContent}
                    className="edit-content-input"
                    placeholder="Nội dung bài viết"
                    style={{ backgroundColor: "#f4f4f4", color: "black" }}
                    height={500}
                  />
                </div>
                <div className="edit-buttons">
                  <button onClick={handleSaveEdit} className="save-button">
                    Lưu
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-button">
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="post-detail-title">{post.title}</h1>
                {post.images && (
                  <div className="post-image-detail-container">
                    <img
                      src={`http://localhost:5000/uploads/${post.images}`}
                      alt="Ảnh bài viết"
                      className="post-detail-image"
                    />
                  </div>
                )}
                <br />
                <ReactMarkdown
                  className="post-detail-body"
                  children={post.nd}
                  remarkPlugins={[remarkGfm, remarkRehype]}
                  rehypePlugins={[rehypeRaw]}
                  skipHtml={true}
                ></ReactMarkdown>
                <div className="post-metadata">
                  <p className="post-author">Tác giả: {post.author.username}</p>
                  <div className="post-detail-date">
                    Đăng ngày: {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
                {isAuthor && (
                  <div className="post-actions">
                    <button onClick={handleEdit} className="edit-button">
                      Chỉnh sửa
                    </button>
                    <button onClick={handleDelete} className="delete-button">
                      Xóa
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="share-section">
              <h4>Chia sẻ bài viết này:</h4>
              <div className="share-buttons">
                <FacebookShareButton
                  url={window.location.href}
                  quote={post.title}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={window.location.href}
                  title={post.title}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={window.location.href}
                  summary={post.nd}
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <EmailShareButton
                  url={window.location.href}
                  subject={post.title}
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>
          </article>
        ) : (
          <div className="error-message">Không tìm thấy bài viết</div>
        )}

        <div className="comments-section">
          <h3 className="comments-title">Bình luận</h3>
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong className="comment-username">
                    {comment.user?.username || "Ẩn danh"}
                  </strong>
                  <small className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
                <p className="comment-content">{comment.content}</p>
              </li>
            ))}
          </ul>
          <div className="comment-form-container">
            <textarea
              className="comment-input"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="comment-submit-button"
            >
              Gửi
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostDetail;
