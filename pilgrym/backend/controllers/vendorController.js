const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Strip anything the form shouldn't be able to set on a review, and drop rows
// that were left blank in the UI.
const sanitizeReviews = (reviews) =>
  (Array.isArray(reviews) ? reviews : [])
    .filter((r) => r && r.name && Number(r.rating) >= 1)
    .map((r) => ({
      name: String(r.name).trim(),
      rating: Math.min(Math.max(Number(r.rating), 1), 5),
      comment: String(r.comment || '').trim(),
      date: r.date ? new Date(r.date) : new Date(),
    }));

// The displayed star rating is always derived from the reviews on the package,
// never taken from the request body.
const applyReviewAggregate = (pkg) => {
  const reviews = pkg.reviews || [];
  if (!reviews.length) return;
  pkg.rating = Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
  pkg.reviewsCount = reviews.length;
};

// A logo uploaded on the package form is the agency's logo, so mirror it onto
// the vendor profile that the public agency page reads from.
const syncAgencyLogo = async (userId, agencyLogo) => {
  if (!agencyLogo) return;
  await User.updateOne({ _id: userId }, { $set: { agencyLogo } });
};

// @desc    Create a new package (always starts out pending admin approval)
// @route   POST /api/vendor/packages
// @access  Private/Vendor
const createPackage = asyncHandler(async (req, res) => {
  const body = req.body;

  if (!body.title || !body.type || !body.price || !body.durationDays || !body.departureDate) {
    res.status(400);
    throw new Error('Title, type, price, duration and departure date are required');
  }

  const pkg = new Package({
    ...body,
    vendor: req.user._id,
    status: 'pending', // vendors can never self-approve
    rejectionReason: '',
    badge: body.badge && body.badge !== 'Verified Agency' ? body.badge : 'None',
    reviews: sanitizeReviews(body.reviews),
    rating: 0,
    reviewsCount: 0,
    slotsBooked: 0,
  });
  applyReviewAggregate(pkg);
  await pkg.save();

  await syncAgencyLogo(req.user._id, pkg.agencyLogo);

  res.status(201).json(pkg);
});

// @desc    Get all of the logged-in vendor's own packages (any status)
// @route   GET /api/vendor/packages
// @access  Private/Vendor
const getMyPackages = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { vendor: req.user._id };
  if (status) query.status = status;

  const packages = await Package.find(query).sort({ createdAt: -1 });
  res.json(packages);
});

// @desc    Update own package. Editing an approved package sends it back for re-review.
// @route   PUT /api/vendor/packages/:id
// @access  Private/Vendor
const updateMyPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findOne({ _id: req.params.id, vendor: req.user._id });
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  const disallowed = ['vendor', 'status', 'rating', 'reviewsCount', 'slotsBooked', 'reviews'];
  Object.entries(req.body).forEach(([key, value]) => {
    if (!disallowed.includes(key)) pkg[key] = value;
  });

  if (req.body.reviews !== undefined) {
    pkg.reviews = sanitizeReviews(req.body.reviews);
    applyReviewAggregate(pkg);
  }

  // Any edit to a live listing puts it back into the review queue
  if (pkg.status === 'approved' || pkg.status === 'rejected') {
    pkg.status = 'pending';
    pkg.rejectionReason = '';
  }

  const updated = await pkg.save();
  await syncAgencyLogo(req.user._id, updated.agencyLogo);
  res.json(updated);
});

// @desc    Delete own package
// @route   DELETE /api/vendor/packages/:id
// @access  Private/Vendor
const deleteMyPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findOne({ _id: req.params.id, vendor: req.user._id });
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  await pkg.deleteOne();
  res.json({ message: 'Package deleted' });
});

// @desc    Get bookings made against this vendor's packages
// @route   GET /api/vendor/bookings
// @access  Private/Vendor
const getVendorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ vendor: req.user._id })
    .populate('package', 'title type price departureDate')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Vendor confirms or cancels a booking on one of their packages
// @route   PUT /api/vendor/bookings/:id
// @access  Private/Vendor
const updateVendorBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Status must be confirmed or cancelled');
  }

  const booking = await Booking.findOne({ _id: req.params.id, vendor: req.user._id });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const pkg = await Package.findById(booking.package);

  if (status === 'confirmed' && booking.status !== 'confirmed') {
    if (pkg && pkg.slotsAvailable < booking.travelers) {
      res.status(400);
      throw new Error('Not enough slots available to confirm this booking');
    }
    if (pkg) {
      pkg.slotsBooked += booking.travelers;
      await pkg.save();
    }
  }
  if (status === 'cancelled' && booking.status === 'confirmed' && pkg) {
    pkg.slotsBooked = Math.max(pkg.slotsBooked - booking.travelers, 0);
    await pkg.save();
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
});

module.exports = {
  createPackage,
  getMyPackages,
  updateMyPackage,
  deleteMyPackage,
  getVendorBookings,
  updateVendorBooking,
};
