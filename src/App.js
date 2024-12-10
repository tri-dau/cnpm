import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PostDetail from "./components/PostDetail";
import CreatePost from "./components/CreatePost";
import LoginRegisterToggle from "./components/LoginRegisterToggle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/auth" element={<LoginRegisterToggle></LoginRegisterToggle>}></Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
