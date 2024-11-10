const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const sequelize = new Sequelize('web_trang_thong_tin', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true
});

const Post = sequelize.define('Post', {
    postid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nd: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userid'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'post',
    timestamps: true,
    updatedAt: false
});

User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({ 
            message: 'Đăng ký thành công',
            userId: user.userid 
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Email hoặc tên người dùng đã tồn tại' });
        } else {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        
        if (password !== user.password) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        
        res.json({ 
            message: 'Đăng nhập thành công',
            user: {
                id: user.userid,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.get('/api/posts', async (req, res) => {
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
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOne({
            where: { postid: postId },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });
        
        if (!post) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
        
        res.json(post);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { title, nd, authorId } = req.body;
        
        if (!title || !nd || !authorId) {
            return res.status(400).json({ 
                error: 'Tiêu đề, nội dung và tác giả không được để trống' 
            });
        }

        const post = await Post.create({
            title,
            nd,
            authorId
        });

        // Lấy thông tin bài viết kèm theo thông tin tác giả
        const postWithAuthor = await Post.findOne({
            where: { postid: post.postid },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        res.status(201).json({
            message: 'Tạo bài viết thành công',
            post: postWithAuthor
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Lỗi server' });
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