import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PostDetail.css";

function PostImage({ imageData }) {
  if (!imageData) return null;

  // Handle base64 or file path images
  const imageSrc = imageData.startsWith('data:') 
    ? imageData 
    : `data:image/jpeg;base64,${imageData}`;

  return (
    <div>
      <img
        src={imageSrc}
        alt="Post content"
        onError={(e) => {
          e.target.style.display = 'none';
          console.error('Failed to load image');
        }}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

function EditForm({ 
  editedTitle, 
  setEditedTitle, 
  editedContent, 
  setEditedContent, 
  handleImageUpload,
  handleSaveEdit,
  handleCancelEdit,
  existingImage,
  selectedImage,
  handleRemoveImage
}) {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Create preview for selected image
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewImage(null);
    }
  }, [selectedImage]);

  return (
    <div>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Tiêu đề bài viết"
      />
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Nội dung bài viết"
      />
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {(existingImage || previewImage) && (
          <div>
            <PostImage imageData={previewImage || existingImage} />
            <button onClick={handleRemoveImage} type="button">
              Xóa ảnh
            </button>
          </div>
        )}
      </div>
      <div>
        <button onClick={handleSaveEdit}>
          Lưu
        </button>
        <button onClick={handleCancelEdit}>
          Hủy
        </button>
      </div>
    </div>
  );
}

function PostContent({ post, isAuthor, handleEdit, handleDelete }) {
  return (
    <>
      <h1>{post.title}</h1>
      <div>{post.nd}</div>
      
      {post.images && <PostImage imageData={post.images} />}

      <div>
        <p>Tác giả: {post.author.username}</p>
        <div>
          Đăng ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        </div>
      </div>
      
      {isAuthor && (
        <div>
          <button onClick={handleEdit}>
            Chỉnh sửa
          </button>
          <button onClick={handleDelete}>
            Xóa
          </button>
        </div>
      )}
    </>
  );
}

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.nd);
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedImage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.nd);
    setSelectedImage(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('nd', editedContent);
      formData.append('authorId', user.id);

      // Handle image upload or removal
      if (selectedImage) {
        formData.append('images', selectedImage);
      } else if (!post.images) {
        // If no new image and no existing image, don't append anything
        formData.append('removeImage', 'true');
      }

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi cập nhật bài viết");
      }

      const updatedPost = await response.json();
      setPost(updatedPost.post);
      setIsEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating post:", error);
      setError(error.message || "Lỗi khi cập nhật bài viết");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorId: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi xóa bài viết");
        }

        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        setError(error.message || "Lỗi khi xóa bài viết");
      }
    }
  };

  const isAuthor = user && post && user.id === post.authorId;

  return (
    <div>
      <header>
        <Link to="/">Trở về trang chủ</Link>
      </header>

      <main>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : post ? (
          <article>
            {isEditing ? (
              <EditForm
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                handleImageUpload={handleImageUpload}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                existingImage={post.images}
                selectedImage={selectedImage}
                handleRemoveImage={handleRemoveImage}
              />
            ) : (
              <PostContent
                post={post}
                isAuthor={isAuthor}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </article>
        ) : (
          <div>Không tìm thấy bài viết</div>
        )}
      </main>
    </div>
  );
}

export default PostDetail;