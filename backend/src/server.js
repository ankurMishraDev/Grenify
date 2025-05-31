import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Debug: Override Express methods to log route registration
const originalMethods = {
  get: app.get.bind(app),
  post: app.post.bind(app),
  put: app.put.bind(app),
  delete: app.delete.bind(app),
  use: app.use.bind(app)
};

app.get = function(path, ...handlers) {
  console.log('🔍 Registering GET route:', path);
  try {
    return originalMethods.get(path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering GET route:', path, error.message);
    throw error;
  }
};

app.post = function(path, ...handlers) {
  console.log('🔍 Registering POST route:', path);
  try {
    return originalMethods.post(path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering POST route:', path, error.message);
    throw error;
  }
};

app.put = function(path, ...handlers) {
  console.log('🔍 Registering PUT route:', path);
  try {
    return originalMethods.put(path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering PUT route:', path, error.message);
    throw error;
  }
};

app.delete = function(path, ...handlers) {
  console.log('🔍 Registering DELETE route:', path);
  try {
    return originalMethods.delete(path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering DELETE route:', path, error.message);
    throw error;
  }
};

app.use = function(path, ...handlers) {
  if (typeof path === 'string') {
    console.log('🔍 Registering middleware/router at:', path);
  }
  try {
    return originalMethods.use(path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering middleware/router:', typeof path === 'string' ? path : 'middleware', error.message);
    throw error;
  }
};

// Try to load routes one by one to identify the problematic one
console.log('📝 Loading auth routes...');
try {
  const authRoutes = await import("./routes/authRoutes.js");
  app.use("/api/auth", authRoutes.default);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  process.exit(1);
}

console.log('📝 Loading user routes...');
try {
  const userRoutes = await import("./routes/userRoutes.js");
  app.use("/api/users", userRoutes.default);
  console.log('✅ User routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
  process.exit(1);
}

console.log('📝 Loading chat routes...');
try {
  const chatRoutes = await import("./routes/chatRoutes.js");
  app.use("/api/chat", chatRoutes.default);
  console.log('✅ Chat routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading chat routes:', error.message);
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  const indexPath = path.join(__dirname, "../frontend/dist/index.html");
  
  if (fs.existsSync(staticPath) && fs.existsSync(indexPath)) {
    console.log("✅ Frontend build found, serving static files");
    app.use(express.static(staticPath));
    
    console.log('📝 Registering catch-all route...');
    // Use regex pattern to avoid path-to-regexp parsing issues
    // This matches any route that doesn't start with /api
    originalMethods.get(/^(?!\/api).*$/, (req, res) => {
      try {
        res.sendFile(indexPath);
      } catch (error) {
        console.error("Error serving static file:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    console.log('✅ Catch-all route registered successfully');
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB();
});