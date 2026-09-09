const express = require("express");

const {
  signup,
  login,
  updateProfilePicture,
} = require("../controllers/authController");

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  upload.single("profilePicture"),
  signup
);

router.post("/login", login);

router.put(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePicture
);

module.exports = router;