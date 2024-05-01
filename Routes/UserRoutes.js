// routes/userRoutes.js
import express, { Router } from "express";
import {
  getUser,
  login,
  logoutUser,
  register,
} from "../Controllers/UserController.js";
import { isAuth } from "../Middlewares/authMiddleware.js";
import {
  bookmarkStory,
  getAllBookmarks,
} from "../Controllers/BookmarkController.js";

const router = Router();
// auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/getUser/:username", getUser);

// bookmark routes
router.post("/bookmark/:id", bookmarkStory);
router.get("/bookmarks/:userId", getAllBookmarks);

export default router;
