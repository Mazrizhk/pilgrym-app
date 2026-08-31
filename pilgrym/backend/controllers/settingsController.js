const asyncHandler = require('express-async-handler');
const SiteSettings = require('../models/SiteSettings');

// Ships as the slideshow content until an admin uploads their own photos.
const DEFAULT_HERO_IMAGES = [
  '/images/hero-kaaba-day.jpg',
  '/images/kaaba-aerial.jpg',
  '/images/kaaba-clocktower.jpg',
  '/images/kaaba-night.jpg',
  '/images/kaaba-skyline.jpg',
];

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) {
    settings = await SiteSettings.create({ key: 'default', heroImages: DEFAULT_HERO_IMAGES });
  }
  return settings;
};

// @desc    Public site settings (currently just the hero slideshow images)
// @route   GET /api/settings
// @access  Public
const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ heroImages: settings.heroImages.length ? settings.heroImages : DEFAULT_HERO_IMAGES });
});

// @desc    Replace the home page hero slideshow images (max 5)
// @route   PUT /api/admin/settings/hero-images
// @access  Private/Admin
const updateHeroImages = asyncHandler(async (req, res) => {
  const { heroImages } = req.body;

  if (!Array.isArray(heroImages) || heroImages.length === 0) {
    res.status(400);
    throw new Error('Provide at least one hero image');
  }
  if (heroImages.length > 5) {
    res.status(400);
    throw new Error('You can add up to 5 hero images');
  }

  const settings = await getOrCreateSettings();
  settings.heroImages = heroImages;
  await settings.save();
  res.json({ heroImages: settings.heroImages });
});

module.exports = { getPublicSettings, updateHeroImages, DEFAULT_HERO_IMAGES };
