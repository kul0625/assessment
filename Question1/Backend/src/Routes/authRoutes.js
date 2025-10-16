const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../Controller/authController");
const auth = require("../Middleware/Auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers", auth, getAllUsers);
module.exports = router;
