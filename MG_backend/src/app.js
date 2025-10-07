import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import dataRoutes from "./routes/data.routes.js";
import userRouter from "./routes/user.routes.js";
import siteRoutes from "./routes/siteroutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
// Trust proxy so secure cookies and protocol detection work behind Render/Vercel proxies
app.set("trust proxy", 1);
app.use(
  cors({
    // Dynamically allow local dev and deployed frontend origins
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_ORIGIN,
        process.env.FRONTEND_ORIGIN_2,
      ].filter(Boolean);

      // Allow no-origin requests (like curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow exact matches or *.vercel.app frontends
      const isAllowed =
        allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);

      return isAllowed
        ? callback(null, true)
        : callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Example GET route for testing
app.get("/api/v1/hello", (req, res) => {
  console.log("hello from hello route");
  res.json({ message: "Hello World from backend!" });
});

// ✅ Test route for file upload (memory storage to avoid FS writes)
const upload = multer({ storage: multer.memoryStorage() });
app.post(
  "/api/v1/test-upload",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  (req, res) => {
    console.log("=== TEST UPLOAD ROUTE ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    res.json({
      message: "Upload test successful",
      body: req.body,
      files: req.files,
    });
  }
);

app.use("/api/data", dataRoutes);

app.use("/api/sites", siteRoutes);

app.use("/api/v1/users", userRouter);

export { app };
