const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Database connection
const sequelize = new Sequelize('web_trang_thong_tin', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define Post model
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

// API endpoint to get posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
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