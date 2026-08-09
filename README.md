# TaskFlow

A full-stack task management app with OTP-verified authentication, categories, filtering, and pagination — built with React, Express, and MongoDB.

## Features

- **Authentication**
  - Signup with email/username, password validation, and OTP email verification
  - Login with either email or username
  - JWT-based sessions (7-day expiry) with automatic logout on token expiry/invalidation
  - Change password via a second OTP verification step
  - Rate limiting on login and OTP endpoints, plus an OTP attempt lockout (5 wrong guesses invalidates the code)

- **Tasks**
  - Full CRUD (create, read, update, delete)
  - Priority (low / medium / high) and status (not started / in progress / completed)
  - Optional category assignment, with live-updating color/name if the category is later edited
  - Filtering by status, priority, and category
  - Sorting (by due date, priority, created date, etc.)
  - Pagination
  - Quick inline status updates from the task list, without opening the edit form

- **Categories**
  - Full CRUD, each scoped to the logged-in user
  - Custom hex color per category (reflected as an accent color on task cards)
  - Deleting a category unassigns it from any tasks that referenced it (tasks become "No category" rather than breaking)
  - Category names are unique per user, but different users can reuse the same name

- **Settings**
  - View/edit profile (name, username, contact number)
  - Change password (OTP-verified)

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- React Hook Form
- Tailwind CSS
- Axios

**Backend**
- Node.js / Express
- MongoDB (Mongoose)
- JWT for auth
- express-validator for request validation
- express-rate-limit for abuse protection
- Resend for transactional email (OTP delivery)
- bcrypt for password hashing

## Live Demo

**Live site:** [https://task-flow-alpha-wheat.vercel.app/](https://task-flow-alpha-wheat.vercel.app/)

Try the app without creating your own account:

- **Email:** `projects.ganesh.dev@gmail.com`
- **Password:** `DemoPass@1234`

> This is a shared demo account seeded with sample tasks and categories. Data may be reset or modified by other visitors from time to time — please don't rely on it for anything you want to keep.

## Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- A MongoDB database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Resend](https://resend.com) account (free tier) for sending OTP emails

### 1. Clone the repo

```bash
git clone https://github.com/Ganesh-E5/to-do.git
cd to-do
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=a_long_random_secret_string
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

> **Note on email:** on Resend's free tier without a verified domain, OTP emails can only be delivered to the email address your Resend account is registered with. To allow signup for arbitrary users, you'll need to verify a domain in the Resend dashboard.

Run the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> This must point at wherever your backend is running — `http://localhost:5000/api` for local development, or your deployed backend's URL (e.g. `https://your-backend.onrender.com/api`) in production.

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Known Limitations

- On Resend's free/unverified tier, OTP emails can only be delivered to the address the Resend account is registered with. New signups using other email addresses won't receive a verification code unless a domain is verified with Resend — use the live demo account above to try the app without this restriction.

## License

Personal project — built as a learning exercise covering full-stack authentication, CRUD design, and deployment.