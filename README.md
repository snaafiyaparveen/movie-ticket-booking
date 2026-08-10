# CineBook — Movie Ticket Booking System

A full-stack movie ticket booking application built for the GUVI × HCL capstone brief.
Users can browse movies, view showtimes by theater/date, select seats on a live seat
map, pay (simulated gateway), and manage bookings. Admins manage movies, theaters, and
shows from a dedicated panel.

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security (JWT), MySQL
- **Frontend:** React 18 (Vite), React Router, Axios — professional dark theme
- **Tests:** JUnit 5 + Mockito
- **Deployment targets:** Backend → Render/Railway/AWS EC2 (Dockerfile included). Frontend → Vercel/Netlify.

---

## 1. Project structure

```
movie-ticket-booking/
├── backend/        Spring Boot REST API
└── frontend/        React (Vite) client
```

## 2. Backend — run locally

### Prerequisites
- JDK 21
- Maven 3.9+ (or use `mvn` if installed — no wrapper is bundled)
- MySQL 8 running locally (or update `application.properties` to point elsewhere)

### Steps
```bash
cd backend

# Create the database (or let the app auto-create it — see application.properties)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_ticket_db;"

# Configure via environment variables (recommended) or edit
# src/main/resources/application.properties directly:
export DB_URL="jdbc:mysql://localhost:3306/movie_ticket_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET="ChangeThisSuperSecretKeyForMovieTicketBookingSystem2026!"

mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Swagger UI: `http://localhost:8080/swagger-ui.html`.

On first boot, a default admin account is seeded automatically:

| Email | Password |
|---|---|
| `admin@movieticket.com` | `Admin@123` |

**Change this password (or remove `DataSeeder`) before any real deployment.**

### Run tests
```bash
mvn test
```

### Notification module (email)
Email sending is **disabled by default** — booking confirmations/cancellations are
logged to the console instead, so the app works out-of-the-box with no SMTP setup.
To send real emails, set:
```bash
export NOTIFICATIONS_ENABLED=true
export MAIL_HOST=smtp.gmail.com
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password   # use a Gmail App Password, not your login password
export MAIL_FROM=your-email@gmail.com
```

### Payment module
`PaymentServiceImpl` simulates a gateway confirmation so the full booking flow works
without external credentials. To integrate a real gateway (Razorpay/Stripe/Cashfree),
replace the block marked `--- Simulated payment gateway call ---` with the provider's
SDK call and verify its response before marking the booking `CONFIRMED`.

---

## 3. Frontend — run locally

### Prerequisites
- Node.js 18+

### Steps
```bash
cd frontend
npm install
cp .env.example .env
# .env → VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
```

Opens on **http://localhost:5173**. The Vite dev server also proxies `/api` to
`http://localhost:8080` (see `vite.config.js`), so `.env` is only strictly required
for the production build.

### Build for production
```bash
npm run build
# output in frontend/dist — deploy this folder to Vercel/Netlify
```

---

## 4. Core modules (per spec)

| Module | Where |
|---|---|
| User | `AuthController`, `UserController`, JWT security |
| Movie | `MovieController` / `MovieService` — CRUD, search |
| Theater | `TheaterController` / `TheaterService` — CRUD, seat layout config |
| Show | `ShowController` / `ShowService` — links movie + theater + time + price |
| Seat Booking | `SeatController` / `SeatServiceImpl` — real-time locking (pessimistic DB lock + `@Version` + TTL hold) prevents double booking |
| Booking | `BookingController` / `BookingServiceImpl` — lifecycle: PENDING → CONFIRMED / CANCELLED / EXPIRED |
| Payment | `PaymentController` / `PaymentServiceImpl` — simulated gateway confirmation |
| Notification | `NotificationService` — email confirmation/cancellation (logs if SMTP not configured) |

## 5. How double-booking is prevented

1. When a user opens a show's seat map, seats are generated once (theater rows × seatsPerRow) and cached.
2. Selecting seats calls `POST /api/seats/lock`, which takes a **pessimistic DB lock**
   on those seat rows, checks they're not already `BOOKED` or actively `LOCKED` by
   someone else, then marks them `LOCKED` with a TTL (`app.seat-lock.ttl-seconds`,
   default 5 minutes) tied to the user.
3. `POST /api/bookings` re-validates the lock belongs to the current user before
   creating a `PENDING` booking.
4. `POST /api/payments` finalizes payment and flips seats to `BOOKED` + booking to
   `CONFIRMED`. If payment never completes, a scheduled job (`ScheduledTasks`) releases
   expired locks and expires stale pending bookings automatically.

---

## 6. Submission checklist (per assignment)

**Code**
- [x] Push the complete project (this repo) to GitHub.
- [x] Code organized into `/backend` and `/frontend` folders.

**Deployment**
- Option 1 — Backend: deploy `backend/` to Render, Railway, or AWS EC2. A `Dockerfile`
  is included in `backend/` for container-based deploys. Set the environment variables
  listed above (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS`,
  etc.) on the host.
- Option 2 — Frontend: deploy `frontend/` to Vercel or Netlify. Set the
  `VITE_API_BASE_URL` environment variable to your deployed backend's `/api` URL, and
  set `CORS_ORIGINS` on the backend to your deployed frontend URL.

---

## 7. Tech stack summary

- **Backend:** Spring Boot, Spring Data JPA, Spring Security + JWT (jjwt)
- **Database:** MySQL (via `mysql-connector-j`)
- **Frontend:** React (Vite), React Router, Axios, react-hot-toast, date-fns
- **Testing:** JUnit 5, Mockito, Spring Security Test, H2 (test-scope)
- **API docs:** springdoc-openapi (Swagger UI)
