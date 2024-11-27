const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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
    images: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
        defaultValue: null,
        get() {
            const rawValue = this.getDataValue('images');
            return rawValue ? rawValue.toString('base64') : null;
        }
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userid'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'post',
    timestamps: true,
    updatedAt: false
});

User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = Post;