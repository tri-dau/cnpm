import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles.css";

function LoginRegisterToggle() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Đăng nhập thất bại");
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (!email.includes("@")) {
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
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Đăng ký thất bại");
        }

        navigate("/login");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="root-container">
      <div className="left-section">
        <h1 className="left-title">TRANG THÔNG TIN</h1>
        <img
          src="https://cdn.pixabay.com/photo/2024/08/22/18/22/city-8990012_960_720.jpg"
          alt="Background"
        />
      </div>

      <div className="right-section">
        <div className="logo-wrapper">
          <img src="dau2.png" alt="Logo" className="logo" />
        </div>

        <div className="toggle-switch">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={toggleMode}
          >
            Đăng nhập
          </button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={toggleMode}
          >
            Đăng ký
          </button>
        </div>

        <form className="form-wrapper" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-wrapper">
            <input
              className="text-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isLogin ? "Tên đăng nhập" : "Tên người dùng"}
              required
            />
          </div>

          {!isLogin && (
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
          )}

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

          {!isLogin && (
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
          )}

          <div className="button-container">
            <button type="submit" className="submit-button">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </div>
        </form>

        <Link to="/" className="home-link">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default LoginRegisterToggle;
