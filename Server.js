import { dbConnect } from "./Database/dbConnection.js";
import dotenv from "dotenv";
import app from "./app.js";

//configure
dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

//database
dbConnect();
