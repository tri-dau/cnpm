import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./PostDetail.css";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
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
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-body">{post.nd}</div>
            <div className="post-metadata">
              <p className="post-author">Tác giả: {post.author.username}</p>
              <div className="post-detail-date">
                Đăng ngày:{" "}
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </article>
        ) : (
          <div className="error-message">Không tìm thấy bài viết</div>
        )}
      </main>
    </div>
  );
}

export default PostDetail;
