const express = require('express');
const { createBooking, getMyBookings, cancelMyBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('user'));

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelMyBooking);

module.exports = router;
