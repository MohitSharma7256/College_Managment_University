const connectToMongo = require("./database/db");
const express = require("express");
const app = express();
const path = require("path");
connectToMongo();
const port = process.env.PORT || 4000;
var cors = require("cors");

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_API_LINK,
  'http://localhost:5173', // Development frontend
  'http://localhost:3000', // Alternative development port
  'https://college-managment-university-frontend.onrender.com' // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.use(express.json()); //to convert request data to json

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

// Serve static files (uploads)
app.use("/media", express.static(path.join(__dirname, "media")));

// API Routes
// TODO: Add rate limiting middleware
app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));

// Start server
app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
