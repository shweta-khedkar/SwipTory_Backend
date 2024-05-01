import mongoose from "mongoose";

export const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "SwipTory",
    })
    .then(() => {
      console.log(`Connected to MongoDB Database SwipTory Successfully`);
    })
    .catch((err) => {
      console.log(`Some error found ${err}`);
    });
};
