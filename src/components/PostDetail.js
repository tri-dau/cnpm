import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PostDetail.css";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    fetchPost();
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
      setEditedContent(data.nd);
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.nd);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          nd: editedContent,
          authorId: user.id,
        }),
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
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="edit-content-input"
                  placeholder="Nội dung bài viết"
                />
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
                <br></br>
                <div className="post-detail-body">{post.nd}</div>
                <div className="post-metadata">
                  <p className="post-author">Tác giả: {post.author.username}</p>
                  <div className="post-detail-date">
                    Đăng ngày:{" "}
                    {new Date(post.createdAt).toLocaleString()}
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
          </article>
        ) : (
          <div className="error-message">Không tìm thấy bài viết</div>
        )}
      </main>
    </div>
  );
}

export default PostDetail;