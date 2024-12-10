const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { postid: req.params.id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, nd, authorId } = req.body;

    if (!title || !nd || !authorId) {
      return res.status(400).json({
        error: "Tiêu đề, nội dung và tác giả không được để trống",
      });
    }

    let imagePath = null;

    if (req.files && req.files.length > 0) {
      imagePath = req.files[0].filename;
    }

    const post = await Post.create({
      title,
      nd,
      authorId,
      images: imagePath,
    });

    const postWithAuthor = await Post.findOne({
      where: { postid: post.postid },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
      ],
    });

    res.status(201).json({
      message: "Tạo bài viết thành công",
      post: postWithAuthor,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, nd, authorId } = req.body;
    const postId = req.params.id;

    const post = await Post.findOne({
      where: { postid: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    if (post.authorId !== parseInt(authorId)) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền chỉnh sửa bài viết này" });
    }

    // Remove old image if a new one is uploaded
    if (req.files && req.files.length > 0) {
      // Delete the old image file if it exists
      if (post.images) {
        const oldImagePath = path.join("uploads", post.images);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    await post.update({
      title,
      nd,
      images:
        req.files && req.files.length > 0 ? req.files[0].filename : post.images,
    });

    const updatedPost = await Post.findOne({
      where: { postid: postId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
      ],
    });

    res.json({
      message: "Cập nhật bài viết thành công",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { authorId } = req.body;
    const postId = req.params.id;

    const post = await Post.findOne({
      where: { postid: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    if (post.authorId !== parseInt(authorId)) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền xóa bài viết này" });
    }

    // Delete the associated image if it exists
    if (post.images) {
      const fullPath = path.join("uploads", post.images);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await post.destroy();
    res.json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
