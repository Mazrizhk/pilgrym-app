const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

// @desc    Book an approved package
// @route   POST /api/bookings
// @access  Private/User
const createBooking = asyncHandler(async (req, res) => {
  const { packageId, travelers, contactPhone, notes } = req.body;

  if (!packageId || !travelers || !contactPhone) {
    res.status(400);
    throw new Error('Package, number of travelers and a contact phone are required');
  }

  const pkg = await Package.findById(packageId);
  if (!pkg || pkg.status !== 'approved') {
    res.status(404);
    throw new Error('This package is not available for booking');
  }
  if (pkg.slotsAvailable < travelers) {
    res.status(400);
    throw new Error(`Only ${pkg.slotsAvailable} slots left on this package`);
  }

  const booking = await Booking.create({
    user: req.user._id,
    package: pkg._id,
    vendor: pkg.vendor,
    travelers,
    totalPrice: pkg.price * Number(travelers),
    contactPhone,
    notes,
    status: 'pending',
  });

  res.status(201).json(booking);
});

// @desc    Get the logged-in user's own bookings
// @route   GET /api/bookings/my
// @access  Private/User
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('package', 'title type price departureDate durationDays images')
    .populate('vendor', 'agencyName')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Cancel own booking (only while still pending)
// @route   PUT /api/bookings/:id/cancel
// @access  Private/User
const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.status === 'confirmed') {
    const pkg = await Package.findById(booking.package);
    if (pkg) {
      pkg.slotsBooked = Math.max(pkg.slotsBooked - booking.travelers, 0);
      await pkg.save();
    }
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});

module.exports = { createBooking, getMyBookings, cancelMyBooking };
