import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json()); // To pass incoming requests with json payloads from (req.body)
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
