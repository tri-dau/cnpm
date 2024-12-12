const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const HTTP_PORT = 5000;

const authController = require("./controllers/authController");
const postController = require("./controllers/postController");

const Post = require("./models/Post");
const User = require("./models/User");
const sequelize = require("./config/database");

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);

// Các cấu hình CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      return cb(new Error("Upload directory does not exist"), false);
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const validatePostContent = (title, content) => {
  if (!title || title.trim().length < 5) {
    return "Tiêu đề phải có ít nhất 5 kí tự";
  }
  if (!content || content.trim().length < 50) {
    return "Nội dung phải có ít nhất 50 kí tự";
  }
  return null;
};

// Authentication routes
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

// Post routes
app.get("/api/posts", postController.getAllPosts);
app.get("/api/posts/:id", postController.getPostById);

app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { title, nd, authorId } = req.body;

    // Validate post content
    const validationError = validatePostContent(title, nd);
    if (validationError) {
      if (req.file) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.status(400).json({ error: validationError });
    }

    req.files = req.file ? [req.file] : [];
    const post = await Post.create({
      title,
      nd,
      authorId,
      images: req.file ? req.file.filename : null,
      createdAt: Date.now(),
    });

    const postWithAuthor = await Post.findOne({
      where: { postid: post.postid },
      include: [{ model: User, as: "author", attributes: ["username"] }],
    });

    res.status(201).json({
      message: "Tạo bài viết thành công",
      post: postWithAuthor,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, nd } = req.body;
    const validationError = validatePostContent(title, nd);
    if (validationError) {
      if (req.file) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.status(400).json({ error: validationError });
    }

    req.files = req.file ? [req.file] : [];

    return postController.updatePost(req, res);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/posts/:id", postController.deletePost);

const commentController = require("./controllers/commentController");

app.get("/api/posts/:postId/comments", commentController.getCommentsByPost);
app.post("/api/posts/:postId/comments", commentController.createComment);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    // TÍNH NĂNG ĐỒNG BỘ VỚI DB (CHỈ BẬT LÊN KHI CÓ THAY ĐỔI QUAN TRỌNG)
    await sequelize.sync({ alter: false });
    console.log("Tables synchronized!");
    app.listen(HTTP_PORT, () => {
      console.log(`HTTP Server running on port ${HTTP_PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
