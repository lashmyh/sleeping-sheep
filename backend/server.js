import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

import "./config/passport.config.js"; 

// load environment variables
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

// routes
app.get("/", (req, res) => {
    res.send("Dreams API");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
