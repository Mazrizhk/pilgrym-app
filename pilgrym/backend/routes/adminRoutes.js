const express = require('express');
const {
  getAllPackages,
  approvePackage,
  rejectPackage,
  adminUpdatePackage,
  adminDeletePackage,
  getAllUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  getAllBookings,
  getStats,
} = require('../controllers/adminController');
const { updateHeroImages } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);

router.get('/packages', getAllPackages);
router.put('/packages/:id/approve', approvePackage);
router.put('/packages/:id/reject', rejectPackage);
router.route('/packages/:id').put(adminUpdatePackage).delete(adminDeletePackage);

router.route('/users').get(getAllUsers).post(adminCreateUser);
router.route('/users/:id').put(adminUpdateUser).delete(adminDeleteUser);

router.get('/bookings', getAllBookings);

router.put('/settings/hero-images', updateHeroImages);

module.exports = router;
