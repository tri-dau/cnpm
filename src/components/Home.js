import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
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
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Unable to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <header className="header">
        <nav className="nav-container">
          <div className="logo-wrapper">
            <img src="dau2.png" alt="Logo" className="logo" />
          </div>
          <div className="auth-buttons">
            {user ? (
              <>
                <span className="welcome-message">Xin chào, {user.username}</span>
                <button onClick={handleLogout} className="logout-button">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button outlined">
                  Login
                </Link>
                <Link to="/register" className="login-button contained">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        {user ? (
          loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="info-message">
              No posts yet.
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.postid} className="post-card">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.nd}</p>
                  <p className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="info-message">Please log in to view posts.</div>
        )}
      </main>
    </div>
  );
}

export default Home;
