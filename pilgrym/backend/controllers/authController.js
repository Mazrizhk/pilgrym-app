const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user or vendor (admins are never created here)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, agencyName, agencyDescription } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const allowedRole = role === 'vendor' ? 'vendor' : 'user';

  if (allowedRole === 'vendor' && !agencyName) {
    res.status(400);
    throw new Error('Agency name is required to register as a vendor');
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
    role: allowedRole,
    phone,
    agencyName: allowedRole === 'vendor' ? agencyName : undefined,
    agencyDescription: allowedRole === 'vendor' ? agencyDescription : undefined,
  });

  res.status(201).json({
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been suspended. Contact support.');
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update own profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, agencyName, agencyDescription, password } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (user.role === 'vendor') {
    if (agencyName) user.agencyName = agencyName;
    if (agencyDescription !== undefined) user.agencyDescription = agencyDescription;
  }
  if (password) user.password = password;

  const updated = await user.save();
  res.json(updated.toSafeObject());
});

module.exports = { register, login, getMe, updateMe };
