const express = require("express");

const {
  createPost,
  getPosts,
  likePost,
  addComment,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Create a post
router.post(
  "/",
  protect,
  upload.single("image"),
  createPost
);

// Get all posts
router.get("/", getPosts);

// Like / unlike a post
router.put("/:id/like", protect, likePost);

// Add a comment
router.post("/:id/comments", protect, addComment);

module.exports = router;