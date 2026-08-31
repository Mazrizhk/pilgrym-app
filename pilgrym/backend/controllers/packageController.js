const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Package = require('../models/Package');
const User = require('../models/User');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfCurrentMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// @desc    Browse approved packages, with filters (public marketplace listing)
// @route   GET /api/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
  const {
    type, // Umrah | Hajj
    vendor, // agency id
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    maxMakkahDistance,
    departureMonth, // 1-12: next departure falling in that calendar month
    upcoming, // 'true': only departures from the current month onwards
    visaIncluded,
    flightsIncluded,
    transportIncluded,
    guidedZiyarah,
    minRating,
    sort, // 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'departure'
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status: 'approved' };

  if (type) query.type = type;
  if (vendor && mongoose.isValidObjectId(vendor)) query.vendor = vendor;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minDuration || maxDuration) {
    query.durationDays = {};
    if (minDuration) query.durationDays.$gte = Number(minDuration);
    if (maxDuration) query.durationDays.$lte = Number(maxDuration);
  }
  if (maxMakkahDistance) query.makkahDistanceM = { $lte: Number(maxMakkahDistance) };

  if (upcoming === 'true') {
    query.departureDate = { $gte: startOfCurrentMonth() };
  }
  const month = Number(departureMonth);
  if (month >= 1 && month <= 12) {
    // Only departures still ahead of us, in the chosen calendar month — so a
    // "June" search in August 2026 surfaces June 2027, not June 2026.
    query.departureDate = { ...(query.departureDate || {}), $gte: startOfToday() };
    query.$expr = { $eq: [{ $month: '$departureDate' }, month] };
  }

  if (visaIncluded === 'true') query.visaIncluded = true;
  if (flightsIncluded === 'true') query.flightsIncluded = true;
  if (transportIncluded === 'true') query.transportIncluded = true;
  if (guidedZiyarah === 'true') query.guidedZiyarah = true;
  if (minRating) query.rating = { $gte: Number(minRating) };

  let sortBy = { createdAt: -1 };
  if (sort === 'price_asc') sortBy = { price: 1 };
  if (sort === 'price_desc') sortBy = { price: -1 };
  if (sort === 'rating') sortBy = { rating: -1 };
  if (sort === 'departure') sortBy = { departureDate: 1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit) || 12, 50);

  const [packages, total] = await Promise.all([
    Package.find(query)
      .populate('vendor', 'agencyName agencyVerified agencyLogo')
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Package.countDocuments(query),
  ]);

  res.json({
    packages,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
  });
});

// @desc    List every registered agency (used by the "Filter by agency" control)
// @route   GET /api/packages/agencies
// @access  Public
const getAgencies = asyncHandler(async (req, res) => {
  const [vendors, counts] = await Promise.all([
    User.find({ role: 'vendor', isActive: true })
      .select('agencyName agencyVerified agencyLogo agencyLocation')
      .sort({ agencyName: 1 }),
    Package.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$vendor', count: { $sum: 1 } } },
    ]),
  ]);

  const countByVendor = new Map(counts.map((c) => [String(c._id), c.count]));

  res.json(
    vendors.map((v) => ({
      _id: v._id,
      agencyName: v.agencyName || v.name,
      agencyVerified: v.agencyVerified,
      agencyLogo: v.agencyLogo,
      agencyLocation: v.agencyLocation,
      packageCount: countByVendor.get(String(v._id)) || 0,
    }))
  );
});

// @desc    Public agency profile — history, reviews, trips and photos
// @route   GET /api/packages/agencies/:id
// @access  Public
const getAgencyProfile = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error('Agency not found');
  }

  const agency = await User.findOne({ _id: req.params.id, role: 'vendor' }).select(
    'name agencyName agencyDescription agencyVerified agencyLogo agencyFoundedYear agencyLocation agencyPhotos phone email createdAt'
  );
  if (!agency) {
    res.status(404);
    throw new Error('Agency not found');
  }

  const packages = await Package.find({ vendor: agency._id, status: 'approved' }).sort({
    departureDate: -1,
  });

  const now = new Date();
  const upcomingTrips = packages
    .filter((p) => new Date(p.departureDate) >= now)
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
  const pastTrips = packages.filter((p) => new Date(p.departureDate) < now);

  const reviews = packages
    .flatMap((p) =>
      (p.reviews || []).map((r) => ({
        _id: r._id,
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        packageTitle: p.title,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : packages.length
    ? Math.round(
        (packages.reduce((sum, p) => sum + (p.rating || 0), 0) /
          (packages.filter((p) => p.rating > 0).length || 1)) *
          10
      ) / 10
    : 0;

  // Gallery: agency-uploaded photos first, then package photography, de-duplicated.
  const photos = [
    ...(agency.agencyPhotos || []),
    ...packages.flatMap((p) => p.images || []),
  ].filter(Boolean);
  const uniquePhotos = [...new Set(photos)].slice(0, 12);

  const foundedYear = agency.agencyFoundedYear || new Date(agency.createdAt).getFullYear();

  res.json({
    agency: {
      _id: agency._id,
      agencyName: agency.agencyName || agency.name,
      agencyDescription: agency.agencyDescription,
      agencyVerified: agency.agencyVerified,
      agencyLogo: agency.agencyLogo,
      agencyLocation: agency.agencyLocation,
      agencyFoundedYear: foundedYear,
      phone: agency.phone,
      email: agency.email,
    },
    stats: {
      yearsOperating: Math.max(new Date().getFullYear() - foundedYear, 0),
      foundedYear,
      packagesListed: packages.length,
      tripsCompleted: pastTrips.length,
      pilgrimsTravelled: packages.reduce((sum, p) => sum + (p.slotsBooked || 0), 0),
      averageRating,
      reviewsCount: reviews.length || packages.reduce((sum, p) => sum + (p.reviewsCount || 0), 0),
    },
    reviews: reviews.slice(0, 20),
    upcomingTrips: upcomingTrips.slice(0, 6),
    pastTrips: pastTrips.slice(0, 6),
    photos: uniquePhotos,
  });
});

// @desc    Get a single approved package (or any status if the requester owns/administers it)
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate(
    'vendor',
    'agencyName agencyVerified agencyLogo agencyDescription phone email'
  );

  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  const isOwnerOrAdmin =
    req.user &&
    (req.user.role === 'admin' || String(pkg.vendor._id) === String(req.user._id));

  if (pkg.status !== 'approved' && !isOwnerOrAdmin) {
    res.status(404);
    throw new Error('Package not found');
  }

  res.json(pkg);
});

module.exports = { getPackages, getPackageById, getAgencies, getAgencyProfile };
