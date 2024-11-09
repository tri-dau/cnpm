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
      
      // Lưu thông tin user
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="root-container">
      <div className="left-section">
        <div className="logo-wrapper">
          <img src="dau2.png" alt="Logo" className="logo" />
        </div>
        <h1 className="left-title">
          TRANG THÔNG TIN
        </h1>
      </div>

      <div className="right-section">
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

          <button
            type="submit"
            className="submit-button"
          >
            Đăng nhập
          </button>
        </form>
        
        <Link to="/" className="home-link">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default Login;