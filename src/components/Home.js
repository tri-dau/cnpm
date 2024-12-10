import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import "./Home.css";
import CreatePostButton from "./CreatePostButton";
import ReactMarkdown from 'react-markdown';

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
    navigate("/");
  };

  return (
    <div style={{ "display": "flex", "flexDirection": "column", "minHeight": "100vh" }}>
      <header className="header">
        <nav className="nav-container">
          <div className="logo-wrapper">
            <img src="dau2.png" alt="Logo" className="logo" />
          </div>
          <h1> TRANG THÔNG TIN CÔNG NGHỆ </h1>
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
                      <div className="post-image-container">
                        <img
                          src={post.images ? `http://localhost:5000/uploads/${post.images}` : "https://picsum.photos/1000?random=1"}
                          alt={post.images ? "Image for this post" : "No image for this post :("}
                          className="post-image"
                        />
                      </div>
                      <div style={{ padding: "1rem" }}>
                        <h2 className="post-title">{post.title}</h2>
                        <ReactMarkdown className="post-description">
                          {post.nd.length > 150
                            ? `${post.nd.substring(0, 150)}...`
                            : post.nd}
                        </ReactMarkdown>
                        <div className="post-metadata">
                          <p className="post-author">
                            Tác giả: {post.author.username}
                          </p>
                          <p className="post-date">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
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
              <div className="welcome-text-section">
                <div className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis varius tristique. Maecenas ut tincidunt velit. Sed nec magna nisl. Nullam tincidunt enim vel nunc ultrices, ac molestie purus malesuada. Cras malesuada tempor dolor, ut laoreet odio vestibulum a.
                </div>
                <div className="auth-buttons">
                  <Link to="/auth" className="login-button outlined">
                    Bắt đầu xem tin ngay !
                  </Link>
                </div>
              </div>
              <div className="welcome-image-section">
                <img
                  src="https://cdn.pixabay.com/photo/2024/06/28/18/47/china-8859961_1280.jpg"
                  alt="Welcome"
                  className="welcome-image"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Liên hệ</h3>
            <div className="contact-info">
              <p>Email: contact@example.com</p>
              <p>Điện thoại: (84) 123-456-789</p>
              <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.DN</p>
            </div>
            <div className="social-links">
              <a href="https://youtu.be/dQw4w9WgXcQ?si=bP5Z6sNCjaXz8hZW" className="social-link" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://github.com/tribeti" className="social-link" target="_blank" rel="noopener noreferrer">
                Github
              </a>
              <a href="https://youtu.be/dQw4w9WgXcQ?si=bP5Z6sNCjaXz8hZW" className="social-link" target="_blank" rel="noopener noreferrer">
                Youtube
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TRI CORP. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;