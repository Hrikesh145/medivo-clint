# Medivo — Medical Camp Management Platform (Client)

Medivo is a full-stack web application that lets organizers create and manage medical camps, and lets participants discover, register for, and pay for those camps online. This repository contains the **client-side application** — a React single-page app that talks to a separate Express/MongoDB backend.

**Live site:** https://medivo-server.vercel.app *(backend API — see [Related Repository](#related-repository) for the frontend deployment link)*
**Backend repository:** https://github.com/Hrikesh145/medivo-server

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [User Roles](#user-roles)
- [Related Repository](#related-repository)

---

## Overview

Medivo connects two types of users:

- **Organizers**, who create medical camps, manage capacity, and review/confirm participant registrations.
- **Participants**, who browse available camps, register, pay the camp fee online, and track their registration and payment history.

Authentication is handled by Firebase, while authorization (role checks for organizer-only or participant-only actions) is enforced on the backend using the Firebase ID token.

## Features

- Email/password and Google sign-in via Firebase Authentication
- Role-based dashboards for Organizers and Participants
- Organizer tools: create camps, edit/update camp details, manage and confirm/reject registrations
- Participant tools: browse available camps, register, view registration status, view payment history, and personal analytics
- Stripe-powered card payments for camp registration fees
- Camp capacity tracking (seats free up automatically when a registration is rejected/cancelled)
- Public feedback section displayed on the homepage
- Protected routes that redirect unauthenticated or unauthorized users
- Toast notifications and confirmation modals for key actions (via `react-hot-toast` and `sweetalert2`)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + DaisyUI |
| Server state / caching | TanStack Query (React Query) |
| Forms | React Hook Form |
| HTTP client | Axios (with a Firebase-token-attached secure instance) |
| Authentication | Firebase Authentication |
| Payments | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) |
| Charts | Recharts |
| Notifications | React Hot Toast, SweetAlert2 |
| Linting | ESLint |

## Project Structure

```
src/
├── components/
│   └── shared/             # Navbar, Footer, Logo — used across layouts
├── contexts/
│   └── AuthContext/        # Firebase auth context + provider
├── firebase/
│   └── firebase.init.js    # Firebase app initialization
├── hooks/
│   ├── useAuth.jsx         # Access auth context
│   ├── useAxios.jsx        # Plain axios instance (public requests)
│   ├── useAxiosSecure.jsx  # Axios instance with Firebase token attached
│   └── useRole.jsx         # Fetches the current user's role (organizer/participant)
├── layouts/
│   ├── RootLayout.jsx      # Public site layout (navbar + footer)
│   ├── AuthLayout.jsx      # Login / registration layout
│   └── DashboardLayout.jsx # Sidebar layout for organizer/participant dashboards
├── pages/
│   ├── Home/                       # Banner, popular camps, stats, feedback
│   ├── About/
│   ├── AvailableCamps/             # Browse and register for camps
│   ├── Authentication/             # Login, Registration, Social login
│   ├── DashboardOrganizer/         # Add/Manage camps, Manage registrations
│   ├── DashboardParticipant/       # Registered camps, Payment history, Analytics
│   ├── DashboardShard/Profile/     # Shared profile page
│   ├── Payment/                    # Stripe payment form
│   └── NotFound/
├── router/
│   └── router.jsx          # Route definitions
├── routers/
│   ├── PrivateRoute.jsx    # Requires a logged-in user
│   ├── OrganizerRoute.jsx  # Requires the "organizer" role
│   └── ParticipantRoute.jsx# Requires the "participant" role
└── main.jsx                 # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Firebase project (for Authentication)
- A Stripe account (for test-mode publishable key)
- The [backend server](https://github.com/Hrikesh145/medivo-server) running locally or deployed

### Installation

```bash
git clone https://github.com/Hrikesh145/medivo-clint.git
cd medivo-clint
npm install
```

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below), then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Environment Variables

Create a `.env.local` file with the following keys:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PUBLISHABLE_KEY=
```

Firebase values are available from your Firebase project settings (Project Settings → General → Your apps). The Stripe publishable key is available from the Stripe Dashboard in test mode.

> The API base URL the client talks to is currently set directly in `src/hooks/useAxios.jsx` and `src/hooks/useAxiosSecure.jsx`. Update these if you're pointing the client at a different backend instance (e.g. a local server).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## User Roles

New users are created with a default role of `user`. An organizer (assigned manually at the database level, or promoted through an admin flow) can access organizer-only routes such as `Add Camp`, `Manage Camps`, and `Manage Registrations`. Once a user has the `participant` role, they can register for camps, make payments, and view their registration/payment history. Role checks are enforced both on the client (via `OrganizerRoute` / `ParticipantRoute`) and on the server, where the Firebase ID token is verified on every protected request.

## Related Repository

This client application depends on the Medivo backend API:

- **Backend:** [medivo-server](https://github.com/Hrikesh145/medivo-server) — Express, MongoDB, Firebase Admin SDK, and Stripe, deployed on Vercel.

The backend exposes REST endpoints for users, camps, registrations, payments, and feedback, and verifies all protected requests using the Firebase ID token sent from this client.