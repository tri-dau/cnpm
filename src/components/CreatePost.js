import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check login status when component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file
    if (selectedFile) {
      // Check file size (15MB limit)
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError('Hình ảnh không được vượt quá 15MB');
        return;
      }

      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Chỉ được tải lên các tệp hình ảnh');
        return;
      }

      // Set image and create preview
      setImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setPreview(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung');
      return;
    }

    // Validate user authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để tạo bài viết');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData to send text and image
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('nd', content.trim());
      formData.append('authorId', user.id);

      // Add image to FormData if selected
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi tạo bài viết');
      }

      const result = await response.json();
      console.log('Bài viết đã được tạo:', result);

      // Revoke preview URL if exists
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <h2 className="form-title">Tạo bài viết mới</h2>

        <div className="form-group">
          <label htmlFor="title" className="form-label">Tiêu đề</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Nội dung</label>
          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung bài viết"
            rows={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hình ảnh (tối đa 1 ảnh)</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />

          {preview && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '10px'
            }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Xóa ảnh
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;