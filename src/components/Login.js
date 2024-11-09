import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
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

          <div className="input-wrapper">
            <input
              className="text-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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