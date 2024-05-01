import Story from "../Models/Story.js";
import User from "../Models/User.js";

//Create Bookmark
export const bookmarkStory = async (req, res) => {
  try {
    let storyId = req.params.id;
    const { userId } = req.body;

    // Find user and story
    const user = await User.findById(userId);
    const story = await Story.findById(storyId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // If the story is already bookmarked, unbookmark it
    const isBookmarked = user.bookmarks.some((bookmark) =>
      bookmark.equals(storyId)
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => !bookmark.equals(storyId)
      );
      story.bookmarks = story.bookmarks.filter(
        (bookmark) => !bookmark.equals(userId)
      );
      await user.save();
      await story.save();

      return res.status(200).json({
        message: "Story unbookmarked successfully",
        bookmarks: user.bookmarks,
        bookmarked: false,
        story,
      });
    } else {
      // Add the story to the user's bookmarks | user bookmarked story
      user.bookmarks.push(storyId);
      await user.save();

      // Add the user to the story's bookmarks | story bookmarked by
      story.bookmarks.push(userId);
      await story.save();

      res.status(200).json({
        message: "Story bookmarked successfully",
        bookmarks: user.bookmarks,
        bookmarked: true,
        story,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error bookmarking story", error: error.message });
  }
};

//Get  All User Bookmarks

export const getAllBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bookmarks = await Story.find({ _id: { $in: user.bookmarks } }).sort({
      createdAt: -1,
    });
    res.status(200).json({ bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookmarks", error });
  }
};
