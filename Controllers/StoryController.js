import mongoose from "mongoose";
import Story from "../Models/Story.js";
import User from "../Models/User.js";

// Create Story
export const createStory = async (req, res, next) => {
  try {
    const { slides, addedBy } = req.body;
    if (!slides || !addedBy) {
      return res.status(400).json("Please provide all the required fields");
    }
    const story = new Story({ slides, addedBy });
    await story.save();
    res.status(201).json({ success: true, story });
  } catch (error) {
    next(new Error("Error creating story"));
  }
};

// Get Stories
export const getStories = async (req, res, n) => {
  const categories = [
    "food",
    "health and fitness",
    "travel",
    "movie",
    "education",
  ];
  const { userId, category, catLimit, cat } = req.query;

  let page = parseInt(req.query.page) || 1;
  let limit = 4 * page;
  let skip = 0;

  try {
    let stories = [];

    // Your Stories
    if (userId) {
      stories = await Story.find({ addedBy: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    // All Stories and Group them by their category
    else if (category && category.toLowerCase() === "all") {
      const groupedStories = {};

      const allStories = await Story.find({
        slides: { $elemMatch: { category: { $in: categories } } },
      })
        .sort({ createdAt: -1 })
        .skip(skip);

      for (const c of categories) {
        const categoryStories = allStories.filter((story) =>
          story.slides.some((slide) => slide.category === c)
        );
        groupedStories[c] = categoryStories.slice(0, cat === c ? catLimit : 4);
      }

      return res
        .status(200)
        .json({ success: true, stories: groupedStories, page });
    }

    // Stories by their Category
    else {
      stories = await Story.find({
        slides: { $elemMatch: { category: category } },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.status(200).json({ success: true, stories, page });
    }

    res.status(200).json({ success: true, stories, page });
  } catch (error) {
    next(new Error("Error getting stories"));
  }
};

// Slides by category
export const getStoryById = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { userId, category } = req.query;
    let story;
    if (category) {
      story = await Story.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(storyId) },
        },
        {
          $unwind: "$slides",
        },
        {
          $match: { "slides.category": category },
        },
        {
          $group: {
            _id: "$_id",
            slides: { $push: "$slides" },
            likes: { $first: "$likes" },
            bookmarks: { $first: "$bookmarks" },
            totalLikes: { $first: "$totalLikes" },
            addedBy: { $first: "$addedBy" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            __v: { $first: "$__v" },
          },
        },
      ]);
      if (!story.length) {
        return res.status(404).json({ error: "Story not found" });
      }
    } else {
      story = await Story.findById(storyId);
    }

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    if (story && story.length) {
      story = story[0];
    }

    let totalLikes = story.likes.length;
    story.totalLikes = totalLikes;

    if (userId) {
      const user = await User.findById(userId);

      if (user) {
        // check if user has liked/bookmarked the story
        const liked = user.likes.includes(storyId);
        const bookmarked = user.bookmarks.includes(storyId);

        return res.status(200).json({
          success: true,
          story,
          liked: liked,
          bookmarked: bookmarked,
          totalLikes,
        });
      }
    } else {
      return res.status(200).json({ success: true, story, totalLikes });
    }
  } catch (error) {
    console.log(error);
    next(new Error("Error getting story"));
  }
};

// Edit Story
export const updateStory = async (req, res, next) => {
  try {
    const { slides, addedBy } = req.body;

    if (!slides || !addedBy) {
      res.status(400).json("Please provide all the required fields");
    }
    const story = await Story.findById(req.params.id);

    if (!story) {
      res.status(404).json({ error: "Story not found" });
    }
    // update story
    story.slides = slides;
    story.addedBy = addedBy;
    await story.save();
    res.status(200).json({ success: true, story });
  } catch (error) {
    next(new Error("Error updating story"));
  }
};
