// Entry point for local development and any traditional (non-serverless) host.
// Vercel deployments use api/index.js instead, which mounts the same app.js.
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Pilgrym API running on port ${PORT}`));
