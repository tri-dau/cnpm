const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const authController = require('./controllers/authController');
const postController = require('./controllers/postController');

const Post = require("./models/Post");
const User = require("./models/User");
const sequelize = require("./config/database");

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Image upload filter
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image uploads are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Validation function for post content
const validatePostContent = (title, content) => {
    if (!title || title.trim().length < 5) {
        return 'Title must be at least 5 characters long';
    }
    if (!content || content.trim().length < 10) {
        return 'Content must be at least 10 characters long';
    }
    return null;
};

// Authentication routes
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Post routes
app.get('/api/posts', postController.getAllPosts);
app.get('/api/posts/:id', postController.getPostById);

// Create post route with additional server-level validation
app.post('/api/posts', upload.array('images', 5), async (req, res) => {
    try {
        const { title, nd, authorId } = req.body;

        // Validate post content
        const validationError = validatePostContent(title, nd);
        if (validationError) {
            // Clean up uploaded files if validation fails
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            return res.status(400).json({ error: validationError });
        }

        // Attach files to the request for the controller to handle
        req.uploadedFiles = req.files || [];

        // Use the controller method
        return postController.createPost(req, res);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update post route
app.put('/api/posts/:id', upload.array('images', 5), async (req, res) => {
    try {
        // Validate post content
        const { title, nd } = req.body;
        const validationError = validatePostContent(title, nd);
        if (validationError) {
            // Clean up uploaded files if validation fails
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            return res.status(400).json({ error: validationError });
        }

        req.uploadedFiles = req.files || [];

        // Use the controller method
        return postController.updatePost(req, res);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete post route
app.delete('/api/posts/:id', postController.deletePost);

// Delete post images route
app.delete('/api/posts/:id/images', async (req, res) => {
    try {
        const postId = req.params.id;
        const { imagesToDelete, authorId } = req.body;

        const post = await Post.findOne({
            where: { postid: postId }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId !== Number(authorId)) {
            return res.status(403).json({ error: 'You do not have permission to edit this post' });
        }

        // Get current images
        const existingImages = post.images ? JSON.parse(post.images) : [];

        // Remove files from filesystem
        imagesToDelete.forEach(imagePath => {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        // Filter out deleted images
        const remainingImages = existingImages.filter(img => !imagesToDelete.includes(img));

        // Update post
        await post.update({
            images: remainingImages.length > 0 ? JSON.stringify(remainingImages) : null
        });

        res.json({
            message: 'Images deleted successfully',
            remainingImages
        });
    } catch (error) {
        console.error('Error deleting images:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 5000;
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        await sequelize.sync({ alter: true });
        console.log('Tables synchronized!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();