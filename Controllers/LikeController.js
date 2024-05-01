import Story from "../Models/Story.js";
import User from "../Models/User.js";

//Like story
export const likeStory = async (req, res) => {
  const storyId = req.params.id;
  const userId = req.body.userId;

  try {
    // Find the user and story
    const story = await Story.findById(storyId);
    const user = await User.findById(userId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already liked the story then un-like it
    if (user.likes.includes(storyId)) {
      const userLikeIndex = user.likes.indexOf(storyId);
      user.likes.splice(userLikeIndex, 1);
      await user.save();

      const storyLikeIndex = story.likes.indexOf(userId);
      story.likes.splice(storyLikeIndex, 1);
      await story.save();

      story.totalLikes = story.likes.length;
      return res.status(200).json({
        message: "Story un-liked successfully",
        totalLikes: story.totalLikes,
        liked: false,
        story: story,
        likes: story.likes,
      });
    }

    // If the user wants to like the story
    else {
      story.likes.push(userId);
      await story.save();

      user.likes.push(storyId);
      await user.save();

      story.totalLikes = story.likes.length;
      res.json({
        message: "Story liked successfully",
        totalLikes: story.totalLikes,
        story: story,
        liked: true,
        likes: story.likes,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
