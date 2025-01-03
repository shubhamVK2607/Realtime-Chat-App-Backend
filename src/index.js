import express from "express";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

connectDB
  .then(() => {
    console.log("Database Successfully Connected...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully started on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connect ", err.message);
  });
