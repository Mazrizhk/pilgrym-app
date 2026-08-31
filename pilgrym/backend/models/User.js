const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // No `select` override here: an explicit `select: true` at the schema
    // level forces Mongoose to include this field even in an inclusion-only
    // projection (e.g. .populate('vendor', 'agencyName agencyVerified')),
    // which was leaking password hashes through every populated vendor/user
    // reference across the API. Leaving it unset restores normal behavior —
    // included on a plain query (needed for login), excluded whenever a
    // query or populate explicitly lists which fields it wants.
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    phone: { type: String, trim: true },

    // Vendor-only fields
    agencyName: { type: String, trim: true },
    agencyDescription: { type: String, trim: true },
    agencyVerified: { type: Boolean, default: false }, // admin badges a vendor "Verified Agency"
    agencyLogo: { type: String, default: '' }, // data URL or path, shown on the agency profile
    agencyFoundedYear: { type: Number }, // drives the "operating for X years" stat
    agencyLocation: { type: String, trim: true, default: '' },
    agencyPhotos: [{ type: String }], // trip photos for the agency profile gallery

    isActive: { type: Boolean, default: true }, // admin can suspend an account
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
