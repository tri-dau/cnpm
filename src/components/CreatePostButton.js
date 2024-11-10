import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePostButton.css';

const CreatePostFAB = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-post');
  };

  return (
    <button
      onClick={handleClick}
      className="fab-button"
      aria-label="Create new post"
    >
      <span className="fab-icon">+</span>
    </button>
  );
};

export default CreatePostFAB;