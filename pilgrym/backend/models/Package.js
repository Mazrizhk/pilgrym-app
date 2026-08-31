const mongoose = require('mongoose');

// Reviews are entered by the agency on the package form (imported from their own
// records) — they are not user-submitted, so there is no author account link.
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const packageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Umrah', 'Hajj'], required: true },
    description: { type: String, trim: true, default: '' },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR' },

    durationDays: { type: Number, required: true, min: 1 },
    departureDate: { type: Date, required: true },

    makkahDistanceM: { type: Number, default: 0 },
    madinahDistanceM: { type: Number, default: 0 },

    visaIncluded: { type: Boolean, default: false },
    flightsIncluded: { type: Boolean, default: false },
    transportIncluded: { type: Boolean, default: false },
    guidedZiyarah: { type: Boolean, default: false },

    hotelRating: { type: Number, min: 1, max: 5, default: 3 },
    images: [{ type: String }],
    agencyLogo: { type: String, default: '' },

    badge: {
      type: String,
      enum: ['None', 'Best Value', 'Popular', 'Verified Agency'],
      default: 'None',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: { type: String, default: '' },

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema],

    slotsTotal: { type: Number, default: 20 },
    slotsBooked: { type: Number, default: 0 },

    freeCancellationDays: { type: Number, default: 15 },
  },
  { timestamps: true }
);

packageSchema.virtual('slotsAvailable').get(function () {
  return Math.max(this.slotsTotal - this.slotsBooked, 0);
});
packageSchema.set('toJSON', { virtuals: true });
packageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Package', packageSchema);
