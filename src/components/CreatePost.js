import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Xử lý chọn hình ảnh
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Kiểm tra số lượng ảnh
    if (selectedFiles.length + images.length > 5) {
      setError('Chỉ được tải lên tối đa 5 hình ảnh');
      return;
    }

    // Kiểm tra kích thước và loại file
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 15 * 1024 * 1024) {
        setError('Mỗi hình ảnh không được vượt quá 15MB');
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError('Chỉ được tải lên các tệp hình ảnh');
        return false;
      }
      return true;
    });

    // Tạo URL preview cho các file hợp lệ
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prevImages => [...prevImages, ...validFiles]);
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    
    // Reset error nếu không có lỗi
    setError('');
  };

  // Xóa ảnh khỏi danh sách
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    
    // Reset file input để có thể chọn lại file đã xóa
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để tạo bài viết');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Tạo FormData để gửi cả text và files
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('nd', content.trim());
      formData.append('authorId', user.id);
      
      // Thêm các file ảnh vào FormData
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
        // Không cần set Content-Type header, nó sẽ tự động được set với boundary cho multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi tạo bài viết');
      }

      const result = await response.json();
      console.log('Bài viết đã được tạo:', result);
      
      // Giải phóng bộ nhớ cho các preview URL
      previews.forEach(URL.revokeObjectURL);
      
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
          <label className="form-label">Hình ảnh (tối đa 5 ảnh)</label>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            multiple 
            onChange={handleImageChange} 
            className="form-input"
          />
          
          {previews.length > 0 && (
            <div className="image-preview-container" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px', 
              marginTop: '10px' 
            }}>
              {previews.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`} 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover', 
                      borderRadius: '4px' 
                    }} 
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
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