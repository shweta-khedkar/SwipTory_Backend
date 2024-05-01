// routers/storyRouter.js
import express, { Router } from "express";
import {
  createStory,
  getStories,
  getStoryById,
  updateStory,
} from "../Controllers/StoryController.js";
import { likeStory } from "../Controllers/LikeController.js";

const router = Router();
// routes
router.post("/create", createStory);
router.get("/getAll", getStories);
router.get("/getById/:storyId", getStoryById);
router.put("/update/:id", updateStory);
router.put("/like/:id", likeStory);

export default router;
