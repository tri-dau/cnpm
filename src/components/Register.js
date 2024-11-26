import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError("Email không hợp lệ");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu và Xác nhận mật khẩu không khớp!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      navigate('/login');
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
            Đăng ký
          </h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-wrapper">
            <input
              className="text-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              required
            />
          </div>

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
              minLength="6"
            />
          </div>

          <div className="input-wrapper">
            <input
              className="text-field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button">
              Đăng ký
            </button>

            <Link to="/login" className="home-link">
              Đăng nhập tại đây
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

export default Register;