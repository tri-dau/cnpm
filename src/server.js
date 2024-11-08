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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'post',
    timestamps: true,
    updatedAt: false
});

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
        
        // So sánh trực tiếp mật khẩu không hash
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
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

const PORT = 5000;
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        
        await sequelize.sync();
        console.log('Tables synchronized!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();