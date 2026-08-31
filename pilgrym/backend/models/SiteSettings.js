const mongoose = require('mongoose');

// Singleton document (always looked up by the fixed `key`) holding
// site-wide configuration that isn't tied to any one package or user —
// currently just the home page hero slideshow images.
const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    heroImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
