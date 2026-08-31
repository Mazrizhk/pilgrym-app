const express = require('express');
const {
  getPackages,
  getPackageById,
  getAgencies,
  getAgencyProfile,
} = require('../controllers/packageController');
const { attachUserIfPresent } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPackages);
// Must be declared before '/:id' so "agencies" isn't read as a package id.
router.get('/agencies', getAgencies);
router.get('/agencies/:id', getAgencyProfile);
router.get('/:id', attachUserIfPresent, getPackageById);

module.exports = router;
