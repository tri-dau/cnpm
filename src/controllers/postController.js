const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { postid: req.params.id },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        if (!post) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }

        // Convert BLOB to base64 for frontend display
        const responsePost = post.toJSON();
        if (responsePost.images) {
            responsePost.images = responsePost.images.toString('base64');
        }

        res.json(responsePost);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, nd, authorId } = req.body;

        if (!title || !nd || !authorId) {
            return res.status(400).json({
                error: 'Tiêu đề, nội dung và tác giả không được để trống'
            });
        }

        let imageBuffer = null;
        if (req.files && req.files.length > 0) {
            imageBuffer = fs.readFileSync(req.files[0].path);
            // Clean up uploaded file
            fs.unlinkSync(req.files[0].path);
        }

        const post = await Post.create({
            title,
            nd,
            authorId,
            images: imageBuffer
        });

        const postWithAuthor = await Post.findOne({
            where: { postid: post.postid },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        // Convert BLOB to base64 for response
        const responsePost = postWithAuthor.toJSON();
        if (responsePost.images) {
            responsePost.images = responsePost.images.toString('base64');
        }

        res.status(201).json({
            message: 'Tạo bài viết thành công',
            post: responsePost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, nd, authorId } = req.body;
        const postId = req.params.id;

        const post = await Post.findOne({
            where: { postid: postId }
        });

        if (!post) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }

        if (post.authorId !== parseInt(authorId)) {
            return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa bài viết này' });
        }

        let imageBuffer = post.images;
        if (req.files && req.files.length > 0) {
            imageBuffer = fs.readFileSync(req.files[0].path);
            fs.unlinkSync(req.files[0].path);
        }

        await post.update({
            title,
            nd,
            images: imageBuffer
        });

        const updatedPost = await Post.findOne({
            where: { postid: postId },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        // Convert BLOB to base64 for response
        const responsePost = updatedPost.toJSON();
        if (responsePost.images) {
            responsePost.images = responsePost.images.toString('base64');
        }

        res.json({
            message: 'Cập nhật bài viết thành công',
            post: responsePost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { authorId } = req.body;
        const postId = req.params.id;

        const post = await Post.findOne({
            where: { postid: postId }
        });

        if (!post) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }

        if (post.authorId !== parseInt(authorId)) {
            return res.status(403).json({ error: 'Bạn không có quyền xóa bài viết này' });
        }

        await post.destroy();
        res.json({ message: 'Xóa bài viết thành công' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};