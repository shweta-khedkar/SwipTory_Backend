// models/user.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
  ],
});

userSchema.index({ username: 1 }); // Index for the username field
userSchema.index({ "bookmarks._id": 1 }); // Index for the bookmarks array
userSchema.index({ "likes._id": 1 }); // Index for the likes array

const User = model("User", userSchema);
export default User;
