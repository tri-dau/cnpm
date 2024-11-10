import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import "./Home.css";
import CreatePostButton from "./CreatePostButton";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/posts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Unable to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header">
        <nav className="nav-container">
          <div className="logo-wrapper">
            <img src="dau2.png" alt="Logo" className="logo" />
          </div>
          <div className="auth-buttons">
            {user ? (
              <>
                <span className="welcome-message">
                  Xin chào, {user.username}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button outlined">
                  Đăng nhập
                </Link>
                <Link to="/register" className="login-button contained">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {user ? (
          <div className="main-content">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : posts.length === 0 ? (
              <div className="info-message">Chưa có bài viết nào.</div>
            ) : (
              <div className="posts-grid">
                {posts.map((post) => (
                  <Link
                    to={`/post/${post.postid}`}
                    key={post.postid}
                    className="post-card"
                  >
                    <article>
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-description">
                        {post.nd.length > 150
                          ? `${post.nd.substring(0, 150)}...`
                          : post.nd}
                      </p>
                      <div className="post-metadata">
                        <p className="post-author">
                          Tác giả: {post.author.username}
                        </p>
                        <p className="post-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
            <CreatePostButton />
          </div>
        ) : (
          <div className="welcome-container">
            <div className="welcome-content">
              <div className="welcome-image-wrapper">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3piMmd5ZjdhdTJ4ZzFvN2Yxb2pqYXV0Y3NjaG1lbWpmaml5eGczdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S2IfEQqgWc0AH4r6Al/giphy.webp"
                  alt="Welcome"
                  className="welcome-image"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
