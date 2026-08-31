# Pilgrym — Hajj & Umrah Marketplace

A full-stack MERN app (MongoDB Atlas, Express, React, Node) built from the Pilgrym mockups: pilgrims
browse and compare verified Umrah/Hajj packages, vendors submit packages for review, and an admin
approves/rejects everything before it goes live.

```
pilgrym/
├── backend/     Express API + Mongoose models (MongoDB Atlas)
└── frontend/    React (Vite) + Tailwind, using the logo & photos you provided
```

## Roles & workflow

| Role   | Can do |
|--------|--------|
| **User** (pilgrim) | Browse & filter approved packages, compare up to 3, book a package, view/cancel their own bookings |
| **Vendor** (agency) | Register with an agency name, add/edit/delete their own packages, see their bookings, confirm/decline them |
| **Admin** | Approve/reject pending packages (with a reason), full CRUD on any package, manage users (suspend, verify agency, change role, delete), view every booking, dashboard stats |

A vendor's package is always created with `status: pending`. It only becomes visible to the public
once an admin approves it. Editing a live (`approved`) package automatically sends it back to
`pending` so the admin can re-check the change. Rejections require a reason, which the vendor sees
on their dashboard.

---

## 1. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → add a database user (username/password)
3. Network Access → add your IP (or `0.0.0.0/0` while developing)
4. Database → Connect → Drivers → copy the connection string, it looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
5. Add a database name before the `?`, e.g. `.../pilgrym?retryWrites=true...`

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: paste your MONGO_URI, and set a random JWT_SECRET
npm install
npm run seed      # wipes and creates demo admin/vendors/user + packages
npm run dev        # starts the API on http://localhost:5000
```

Demo logins created by the seed script:

| Role   | Email                     | Password    |
|--------|---------------------------|-------------|
| Admin  | admin@pilgrym.lk          | admin1234   |
| Vendor | noor@noortravels.lk       | vendor1234  |
| User   | user@pilgrym.lk           | user1234    |

(3 more vendor accounts are seeded too — rayyan@rayyantravels.lk, zam@zamzamtravels.lk,
safa@safaholidays.lk — all with password `vendor1234`.)

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # opens http://localhost:5173
```

The logo and Kaaba/Madinah photos you shared are already in `frontend/public/images/` and wired
into the homepage hero, package cards and seed data.

---

## API reference

Base URL: `/api`

**Auth** — `/auth`
- `POST /register` — `{ name, email, password, role: 'user'|'vendor', phone, agencyName, agencyDescription }`
- `POST /login` — `{ email, password }`
- `GET /me` (auth) / `PUT /me` (auth)

**Public marketplace** — `/packages`
- `GET /` — filters: `type, minPrice, maxPrice, minDuration, maxDuration, maxMakkahDistance, visaIncluded, flightsIncluded, transportIncluded, guidedZiyarah, minRating, sort, page, limit`
- `GET /:id`

**Vendor** — `/vendor` (auth, role `vendor`)
- `GET /packages`, `POST /packages`, `PUT /packages/:id`, `DELETE /packages/:id`
- `GET /bookings`, `PUT /bookings/:id` — `{ status: 'confirmed'|'cancelled' }`

**Admin** — `/admin` (auth, role `admin`)
- `GET /stats`
- `GET /packages` (any status), `PUT /packages/:id/approve`, `PUT /packages/:id/reject` `{ reason }`, `PUT /packages/:id`, `DELETE /packages/:id`
- `GET /users`, `POST /users`, `PUT /users/:id` (role, isActive, agencyVerified…), `DELETE /users/:id`
- `GET /bookings`

**Bookings** — `/bookings` (auth, role `user`)
- `POST /` — `{ packageId, travelers, contactPhone, notes }`
- `GET /my`, `PUT /:id/cancel`

---

## Notes & next steps

- **Images**: vendors currently paste image URLs when adding a package. For real file uploads, wire
  in an S3/Cloudinary upload step and swap the URL field for a file input.
- **Payments**: bookings are created as `pending` requests the vendor confirms manually — no payment
  gateway is wired in. Stripe or a local Sri Lankan gateway (PayHere, etc.) would plug into the
  booking confirmation step.
- **Deployment**: the backend is a plain Express app (deploy to Railway/Render/Fly.io) and the
  frontend is a static Vite build (deploy to Vercel/Netlify) — just point `VITE_API_URL` at your
  deployed API and `CLIENT_URL` at your deployed frontend.
- **Design tokens** live in `frontend/tailwind.config.js` (`primary` = teal, `gold` = accent) if you
  want to adjust the palette.
