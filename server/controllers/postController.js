const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // At least text or image is required
    if (!text?.trim() && !imageUrl) {
      return res.status(400).json({
        message: "Post must contain text or an image",
      });
    }

    const post = await Post.create({
      userId: req.user.userId,
      username: req.user.name,
      text: text?.trim() || "",
      imageUrl,
      likes: [],
      comments: [],
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name profilePicture")
      .sort({
        createdAt: -1,
      });

    res.json({
      posts,
    });
  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = post.likes.find(
      (like) => like.userId.toString() === req.user.userId.toString()
    );

    if (existingLike) {
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== req.user.userId.toString()
      );
    } else {
      post.likes.push({
        userId: req.user.userId,
        username: req.user.name,
      });
    }

    await post.save();

    res.json({
      message: existingLike ? "Post unliked" : "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      userId: req.user.userId,
      username: req.user.name,
      text: text.trim(),
    });

    await post.save();

    res.status(201).json({
      message: "Comment added",
      comment: post.comments[post.comments.length - 1],
    });
  } catch (error) {
    console.error("COMMENT ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
};