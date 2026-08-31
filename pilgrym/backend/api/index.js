// Vercel serverless entry point. Vercel treats every file under /api as its
// own function; this one is mounted at /api and vercel.json rewrites every
// request path to it, so the Express app inside sees the original URL
// (e.g. /api/packages) and routes it exactly as it does locally.
const mongoose = require('mongoose');
const app = require('../app');

// Reused across warm invocations of the same function instance so we don't
// open a new MongoDB connection on every request.
let connectionPromise = null;

const ensureConnected = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      connectionPromise = null; // let the next request retry instead of failing forever
      throw err;
    });
  }
  return connectionPromise;
};

module.exports = async (req, res) => {
  try {
    await ensureConnected();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
    return;
  }
  app(req, res);
};
