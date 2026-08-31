// Populates MongoDB Atlas with demo data matching the Pilgrym mockups:
// an admin, four vendor agencies, a normal user, and a set of approved
// (plus one pending, one rejected) Umrah/Hajj packages.
//
// Departure dates are generated relative to today so the "Upcoming Departures"
// section on the home page always has something to show.
//
// Run with:   npm run seed
// Wipe with:  npm run seed:destroy
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');

// UTC so the stored month always matches the month we intended, whatever the
// server's timezone is.
const monthsAhead = (n, day = 12) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + n, day));
};
const monthsAgo = (n, day = 12) => monthsAhead(-n, day);

const run = async () => {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await Promise.all([User.deleteMany(), Package.deleteMany(), Booking.deleteMany()]);
    console.log('All collections cleared.');
    return mongoose.connection.close();
  }

  await Promise.all([User.deleteMany(), Package.deleteMany(), Booking.deleteMany()]);

  const admin = await User.create({
    name: 'Maz Rizvi',
    email: 'admin@pilgrym.lk',
    password: 'admin1234',
    role: 'admin',
  });

  const vendorsData = [
    {
      name: 'Noor Rahman',
      email: 'noor@noortravels.lk',
      password: 'vendor1234',
      role: 'vendor',
      agencyName: 'Noor Travels',
      agencyDescription:
        'Premium Umrah & Hajj operator based in Colombo. We have taken more than 4,000 Sri Lankan pilgrims to the Haramain since 2013, with a dedicated Sinhala and Tamil speaking guide on every departure.',
      agencyVerified: true,
      agencyFoundedYear: 2013,
      agencyLocation: 'Colombo 06, Sri Lanka',
      agencyPhotos: ['/images/kaaba-clocktower.jpg', '/images/kaaba-night.jpg'],
      phone: '+94 77 123 4567',
    },
    {
      name: 'Rayyan Fazil',
      email: 'rayyan@rayyantravels.lk',
      password: 'vendor1234',
      role: 'vendor',
      agencyName: 'Rayyan Travels',
      agencyDescription:
        'Deluxe hotel-focused Umrah packages, always within walking distance of the Haram. Small groups of 25 so nobody gets lost in the crowd.',
      agencyVerified: true,
      agencyFoundedYear: 2016,
      agencyLocation: 'Kandy, Sri Lanka',
      agencyPhotos: ['/images/kaaba-skyline.jpg'],
      phone: '+94 77 234 5678',
    },
    {
      name: 'Zam Hassan',
      email: 'zam@zamzamtravels.lk',
      password: 'vendor1234',
      role: 'vendor',
      agencyName: 'ZamZam Travels',
      agencyDescription:
        'Budget-friendly, high-volume Umrah packages for groups and families. Group discounts from 6 travellers upwards.',
      agencyVerified: true,
      agencyFoundedYear: 2009,
      agencyLocation: 'Colombo 12, Sri Lanka',
      agencyPhotos: ['/images/hero-kaaba-day.jpg'],
      phone: '+94 77 345 6789',
    },
    {
      name: 'Safa Nazeer',
      email: 'safa@safaholidays.lk',
      password: 'vendor1234',
      role: 'vendor',
      agencyName: 'Safa Holidays',
      agencyDescription:
        'Economy Umrah packages with a focus on first-timers. Every group gets a pre-departure briefing session in Colombo.',
      agencyVerified: false,
      agencyFoundedYear: 2020,
      agencyLocation: 'Galle, Sri Lanka',
      agencyPhotos: ['/images/madinah-arches.jpg'],
      phone: '+94 77 456 7890',
    },
  ];
  const vendors = await User.create(vendorsData);
  const [noor, rayyan, zamzam, safa] = vendors;

  const demoUser = await User.create({
    name: 'Ahmed Fowzan',
    email: 'user@pilgrym.lk',
    password: 'user1234',
    role: 'user',
    phone: '+94 71 987 6543',
  });

  const img = (name) => `/images/${name}`;

  const packagesData = [
    {
      vendor: noor._id,
      title: 'Premium Umrah Package',
      type: 'Umrah',
      description:
        'Our flagship Umrah package: 5-star hotels within 150m of both Haram sites, private transport, and a dedicated guide for every ziyarah.',
      price: 299000,
      durationDays: 12,
      departureDate: monthsAhead(0, 24),
      makkahDistanceM: 150,
      madinahDistanceM: 150,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 5,
      images: [img('kaaba-clocktower.jpg'), img('kaaba-night.jpg')],
      badge: 'Best Value',
      status: 'approved',
      rating: 4.7,
      reviewsCount: 3,
      reviews: [
        {
          name: 'Fathima Rizwan',
          rating: 5,
          comment:
            'The hotel was genuinely 150m from the Haram — we walked to every prayer. The guide stayed with our group the whole time.',
          date: monthsAgo(2, 8),
        },
        {
          name: 'Mohamed Irfan',
          rating: 5,
          comment: 'Everything was exactly as listed on the page. No hidden charges at all.',
          date: monthsAgo(4, 19),
        },
        {
          name: 'Nusrath Haleem',
          rating: 4,
          comment: 'Excellent trip. Only the airport transfer in Jeddah kept us waiting a while.',
          date: monthsAgo(7, 3),
        },
      ],
      slotsTotal: 30,
      slotsBooked: 6,
    },
    {
      vendor: rayyan._id,
      title: 'Deluxe Umrah Package',
      type: 'Umrah',
      description:
        '10 days across two deluxe hotels, both under 250m from the Haram, with guided ziyarah tours in Makkah and Madinah.',
      price: 249000,
      durationDays: 10,
      departureDate: monthsAhead(0, 18),
      makkahDistanceM: 250,
      madinahDistanceM: 200,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 4,
      images: [img('kaaba-skyline.jpg')],
      badge: 'Popular',
      status: 'approved',
      rating: 4.5,
      reviewsCount: 2,
      reviews: [
        {
          name: 'Aysha Marzook',
          rating: 5,
          comment: 'Group of 25 meant we were never waiting around. Ziyarah in Madinah was the highlight.',
          date: monthsAgo(3, 14),
        },
        {
          name: 'Rifkan Ameer',
          rating: 4,
          comment: 'Good value for a deluxe package. Food could have had more Sri Lankan options.',
          date: monthsAgo(6, 22),
        },
      ],
      slotsTotal: 25,
      slotsBooked: 14,
    },
    {
      vendor: zamzam._id,
      title: 'Classic Umrah Package',
      type: 'Umrah',
      description:
        'A well-rounded 7-day Umrah trip with visa, flights and transport included, and hotels within walking distance of both Haramain.',
      price: 189000,
      durationDays: 7,
      departureDate: monthsAhead(1, 9),
      makkahDistanceM: 600,
      madinahDistanceM: 400,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 3,
      images: [img('hero-kaaba-day.jpg')],
      badge: 'Verified Agency',
      status: 'approved',
      rating: 4.5,
      reviewsCount: 2,
      reviews: [
        {
          name: 'Shameem Farook',
          rating: 5,
          comment: 'Third time travelling with ZamZam. Consistently well organised for the price.',
          date: monthsAgo(1, 27),
        },
        {
          name: 'Hilmy Nazar',
          rating: 4,
          comment: 'Hotel was a 600m walk as advertised — fine for us, worth knowing if you have elders.',
          date: monthsAgo(5, 11),
        },
      ],
      slotsTotal: 40,
      slotsBooked: 9,
    },
    {
      vendor: safa._id,
      title: 'Economy Umrah Package',
      type: 'Umrah',
      description:
        'An affordable 7-day Umrah package for first-timers, with visa and flights included and a comfortable 3-star stay.',
      price: 159000,
      durationDays: 7,
      departureDate: monthsAhead(1, 21),
      makkahDistanceM: 800,
      madinahDistanceM: 600,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: false,
      guidedZiyarah: false,
      hotelRating: 3,
      images: [img('madinah-arches.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.5,
      reviewsCount: 2,
      reviews: [
        {
          name: 'Imran Sally',
          rating: 5,
          comment: 'First Umrah for both of us. The pre-departure briefing in Colombo made all the difference.',
          date: monthsAgo(2, 2),
        },
        {
          name: 'Zahra Iqbal',
          rating: 4,
          comment: 'Great price. Arrange your own transport in Makkah — that part is not included.',
          date: monthsAgo(8, 16),
        },
      ],
      slotsTotal: 35,
      slotsBooked: 2,
    },
    {
      vendor: noor._id,
      title: 'Ziyarah Plus Umrah Package',
      type: 'Umrah',
      description:
        '9 nights with an extended ziyarah programme in Madinah — Uhud, Quba and the Seven Mosques — plus 4-star stays in both cities.',
      price: 274000,
      durationDays: 9,
      departureDate: monthsAhead(2, 6),
      makkahDistanceM: 300,
      madinahDistanceM: 250,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 4,
      images: [img('madinah-arches.jpg'), img('kaaba-aerial.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.8,
      reviewsCount: 1,
      reviews: [
        {
          name: 'Rizwan Majeed',
          rating: 5,
          comment: 'The ziyarah programme is the reason to book this one. Very knowledgeable guide.',
          date: monthsAgo(3, 5),
        },
      ],
      slotsTotal: 28,
      slotsBooked: 11,
    },
    {
      vendor: zamzam._id,
      title: 'Family Umrah Package',
      type: 'Umrah',
      description:
        'Built around families: connecting rooms, a flexible itinerary and group pricing from six travellers upwards.',
      price: 205000,
      durationDays: 11,
      departureDate: monthsAhead(3, 15),
      makkahDistanceM: 450,
      madinahDistanceM: 350,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: false,
      hotelRating: 4,
      images: [img('kaaba-aerial.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.6,
      reviewsCount: 1,
      reviews: [
        {
          name: 'Sabra Latheef',
          rating: 5,
          comment: 'Travelled with three children and two grandparents. They handled every request patiently.',
          date: monthsAgo(4, 9),
        },
      ],
      slotsTotal: 45,
      slotsBooked: 18,
    },
    {
      vendor: rayyan._id,
      title: 'Ramadan Umrah Special',
      type: 'Umrah',
      description:
        '14-night Ramadan package timed around the last 10 nights, 5-star stay in both cities, iftar and suhoor included.',
      price: 415000,
      durationDays: 14,
      departureDate: monthsAhead(5, 4),
      makkahDistanceM: 100,
      madinahDistanceM: 180,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 5,
      images: [img('kaaba-night.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.9,
      reviewsCount: 1,
      reviews: [
        {
          name: 'Ashraff Hussain',
          rating: 5,
          comment: 'Last 10 nights in Makkah with this group was unforgettable. Book early, it fills up.',
          date: monthsAgo(9, 20),
        },
      ],
      slotsTotal: 20,
      slotsBooked: 12,
    },
    {
      vendor: noor._id,
      title: 'Executive Umrah Retreat',
      type: 'Umrah',
      description:
        'A short 6-day executive Umrah for travellers who cannot take long leave — direct flights and a hotel on the Haram courtyard.',
      price: 335000,
      durationDays: 6,
      departureDate: monthsAhead(4, 11),
      makkahDistanceM: 80,
      madinahDistanceM: 120,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: false,
      hotelRating: 5,
      images: [img('kaaba-clocktower.jpg')],
      badge: 'None',
      status: 'pending', // sitting in the admin approval queue
      slotsTotal: 20,
      slotsBooked: 0,
    },
    {
      vendor: rayyan._id,
      title: 'Group Hajj Package',
      type: 'Hajj',
      description: 'Full Hajj package with Aziziyah accommodation and guided rites throughout.',
      price: 890000,
      durationDays: 21,
      departureDate: monthsAhead(8, 20),
      makkahDistanceM: 900,
      madinahDistanceM: 700,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 4,
      images: [img('kaaba-aerial.jpg')],
      badge: 'None',
      status: 'rejected', // example of a listing sent back to the vendor
      rejectionReason: 'Please attach your Hajj operating license before resubmitting.',
      slotsTotal: 50,
      slotsBooked: 0,
    },
    {
      vendor: zamzam._id,
      title: 'Hajj 2027 Standard Package',
      type: 'Hajj',
      description:
        'Complete Hajj package including Mina and Arafat tents, Aziziyah accommodation and full guidance through every rite.',
      price: 795000,
      durationDays: 24,
      departureDate: monthsAhead(9, 14),
      makkahDistanceM: 1200,
      madinahDistanceM: 600,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 3,
      images: [img('kaaba-skyline.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.4,
      reviewsCount: 1,
      reviews: [
        {
          name: 'Nizam Careem',
          rating: 4,
          comment: 'Well run Hajj group. Aziziyah accommodation is basic but the guidance was excellent.',
          date: monthsAgo(11, 6),
        },
      ],
      slotsTotal: 50,
      slotsBooked: 21,
    },
    // A completed trip, so agency profiles have real history to show.
    {
      vendor: noor._id,
      title: 'Umrah Group Departure (Completed)',
      type: 'Umrah',
      description: 'A past 10-day group departure, kept on the profile as trip history.',
      price: 265000,
      durationDays: 10,
      departureDate: monthsAgo(3, 10),
      makkahDistanceM: 200,
      madinahDistanceM: 220,
      visaIncluded: true,
      flightsIncluded: true,
      transportIncluded: true,
      guidedZiyarah: true,
      hotelRating: 4,
      images: [img('kaaba-night.jpg')],
      badge: 'None',
      status: 'approved',
      rating: 4.7,
      reviewsCount: 1,
      reviews: [
        {
          name: 'Munas Thassim',
          rating: 5,
          comment: 'Travelled on this departure and it ran exactly to schedule from Colombo to Colombo.',
          date: monthsAgo(2, 24),
        },
      ],
      slotsTotal: 30,
      slotsBooked: 28,
    },
  ];

  const packages = await Package.create(packagesData);

  await Booking.create({
    user: demoUser._id,
    package: packages[0]._id,
    vendor: packages[0].vendor,
    travelers: 2,
    totalPrice: packages[0].price * 2,
    contactPhone: '+94 71 987 6543',
    notes: 'Would prefer a room on a lower floor if possible.',
    status: 'pending',
  });

  console.log('Seed complete.');
  console.log('Admin login:   admin@pilgrym.lk / admin1234');
  console.log('Vendor login:  noor@noortravels.lk / vendor1234');
  console.log('User login:    user@pilgrym.lk / user1234');

  await mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
