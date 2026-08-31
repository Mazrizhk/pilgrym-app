const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');
const User = require('../models/User');
const Booking = require('../models/Booking');

// ---------- PACKAGES ----------

// @desc    Get all packages, any status, with optional status/type filter
// @route   GET /api/admin/packages
// @access  Private/Admin
const getAllPackages = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const packages = await Package.find(query)
    .populate('vendor', 'name agencyName email agencyVerified')
    .sort({ createdAt: -1 });
  res.json(packages);
});

// @desc    Approve a pending package, optionally assigning a display badge
// @route   PUT /api/admin/packages/:id/approve
// @access  Private/Admin
const approvePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  pkg.status = 'approved';
  pkg.rejectionReason = '';
  if (req.body.badge) pkg.badge = req.body.badge;
  await pkg.save();
  res.json(pkg);
});

// @desc    Reject a pending package with a reason the vendor will see
// @route   PUT /api/admin/packages/:id/reject
// @access  Private/Admin
const rejectPackage = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error('A rejection reason is required so the vendor can fix it');
  }
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  pkg.status = 'rejected';
  pkg.rejectionReason = reason;
  await pkg.save();
  res.json(pkg);
});

// @desc    Admin full edit of any package (CRUD)
// @route   PUT /api/admin/packages/:id
// @access  Private/Admin
const adminUpdatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  Object.entries(req.body).forEach(([key, value]) => {
    if (key !== 'vendor') pkg[key] = value;
  });
  const updated = await pkg.save();
  res.json(updated);
});

// @desc    Admin delete any package
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
const adminDeletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  await pkg.deleteOne();
  res.json({ message: 'Package deleted' });
});

// ---------- USERS / VENDORS ----------

// @desc    List all users (filter by role)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const query = {};
  if (role) query.role = role;
  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Admin creates a user directly (incl. other admins)
// @route   POST /api/admin/users
// @access  Private/Admin
const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, agencyName, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    agencyName,
    phone,
  });
  res.status(201).json(user.toSafeObject());
});

// @desc    Update a user - role, suspend/reactivate, verify agency, etc.
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, role, isActive, agencyName, agencyVerified, phone } = req.body;
  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (agencyName !== undefined) user.agencyName = agencyName;
  if (agencyVerified !== undefined) user.agencyVerified = agencyVerified;
  if (phone !== undefined) user.phone = phone;

  const updated = await user.save();
  res.json(updated.toSafeObject());
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// ---------- BOOKINGS ----------

// @desc    Get every booking on the platform
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('package', 'title type price')
    .populate('user', 'name email')
    .populate('vendor', 'name agencyName')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// ---------- DASHBOARD ----------

// @desc    Summary counts for the admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [pendingPackages, approvedPackages, rejectedPackages, totalVendors, totalUsers, totalBookings, confirmedBookings] =
    await Promise.all([
      Package.countDocuments({ status: 'pending' }),
      Package.countDocuments({ status: 'approved' }),
      Package.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
    ]);

  res.json({
    pendingPackages,
    approvedPackages,
    rejectedPackages,
    totalVendors,
    totalUsers,
    totalBookings,
    confirmedBookings,
  });
});

module.exports = {
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
};
