import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="root-container">
      <div className="left-section">
        <h1 className="left-title">
          TRANG THÔNG TIN
        </h1>
        <img src='https://cdn.pixabay.com/photo/2024/08/22/18/22/city-8990012_960_720.jpg'></img>
      </div>

      <div className="right-section">
      <div className="logo-wrapper">
          <img src="dau2.png" alt="Logo" className="logo" />
        </div>
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <h2 className="form-title">
            Đăng nhập
          </h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-wrapper">
            <input
              className="text-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              required
            />
          </div>

          <div className="input-wrapper">
            <input
              className="text-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button">
              Đăng nhập
            </button>
            
            <Link to="/register" className="home-link">
              Đăng kí tại đây
            </Link>

            <Link to="/" className="home-link">
              Về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;