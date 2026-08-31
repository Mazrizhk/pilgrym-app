const express = require('express');
const {
  createPackage,
  getMyPackages,
  updateMyPackage,
  deleteMyPackage,
  getVendorBookings,
  updateVendorBooking,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('vendor'));

router.route('/packages').get(getMyPackages).post(createPackage);
router.route('/packages/:id').put(updateMyPackage).delete(deleteMyPackage);

router.get('/bookings', getVendorBookings);
router.put('/bookings/:id', updateVendorBooking);

module.exports = router;
