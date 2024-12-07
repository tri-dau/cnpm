const Comment = require("../models/Comment");
const User = require("../models/User");

const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { postId: req.params.postId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username'] // Lấy tên người dùng
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const createComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    const newComment = await Comment.create({ postId, userId, content });

    const commentWithUser = await Comment.findOne({
      where: { id: newComment.id },
      include: { model: User, as: "user", attributes: ["username"] },
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = { getCommentsByPost, createComment };
