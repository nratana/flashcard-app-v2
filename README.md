# FlashCard Learning App (v2)

## What is this?

A flashcard study app where users can create accounts, build their own flashcard decks, and study them by flipping cards to reveal answers. Theres also an admin dashboard where admins can see all users and their study history. Built for UTS Internet Programming.

## Tech stack

- React (Vite) — frontend
- Node.js + Express — backend API
- MongoDB Atlas — database
- Mongoose — connects Express to MongoDB
- bcryptjs — password hashing
- jsonwebtoken (JWT) — user authentication
- dotenv — environment variables

## Features

- Register and login with email/password
- Passwords are hashed (not stored as plain text)
- JWT token keeps you logged in
- Create, edit, delete flashcards
- Click cards to flip and reveal answers
- Mark cards as used, restore them later
- Live search bar that filters cards as you type
- Study history is tracked automatically when you flip a card
- Profile page to edit your name/email or delete account
- Admin dashboard to view all users and study history
- Role-based access (regular user vs admin)
- Responsive design works on mobile
- Error handling for failed API calls
- No hardcoded credentials (uses .env file)

## Folder structure

```
flashcard-app-v2/
├── backend/
│   ├── server.js              # main server, connects everything
│   ├── .env                   # environment variables (mongo url, jwt secret)
│   ├── package.json
│   ├── models/
│   │   ├── User.js            # user schema with password hashing
│   │   ├── Flashcard.js       # flashcard schema tied to user
│   │   └── ViewHistory.js     # tracks when users study cards
│   ├── routes/
│   │   ├── userRoutes.js      # register, login, profile, admin user mgmt
│   │   ├── flashcardRoutes.js # CRUD for flashcards + record views
│   │   └── historyRoutes.js   # view history for user and admin
│   └── middleware/
│       └── auth.js            # JWT verification + admin check
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # main component, handles page routing + auth
│       ├── api.js             # all API calls in one place
│       ├── index.css          # all styling
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── DashboardPage.jsx  # flashcards + search
│           ├── ProfilePage.jsx
│           ├── HistoryPage.jsx
│           └── AdminPage.jsx
├── flashcards_export.json
└── README.md
```

## How to run

Need Node.js and a MongoDB Atlas account.

Backend (terminal 1):
```
cd backend
npm install
npm start
```
Should say "Connected to MongoDB", runs on localhost:8000

Frontend (terminal 2):
```
cd frontend
npm install
npm run dev
```
Opens on localhost:5173

## Creating an admin account

Register a normal account first, then go to MongoDB Atlas → browse collections → flashcardDB_v2 → users → find your user → change the role field from "user" to "admin". Refresh the app and you'll see the Admin tab.

## Database

MongoDB Atlas free tier. Database is `flashcardDB_v2` with three collections: `users`, `flashcards`, `viewhistories`. Sample export in flashcards_export.json.

## Three entities with CRUD

1. **Users** — create (register), read (profile), update (edit name/email), delete (delete account)
2. **Flashcards** — create, read, update, delete (each user has their own cards)
3. **View History** — create (auto when flipping card), read (history page), delete (clear history)

## Workload allocation

Completed individually by Naya Ratanapruksakul.

## Challenges

JWT was confusing at first — had to figure out how to store the token in localStorage and attach it to every request using the Authorization header. Password hashing with bcrypt was new, took a while to understand the pre-save hook in Mongoose. The live search was actually easier than expected, just filtering the cards array based on the search input. Biggest headache was getting the admin role working since you have to manually change the role in MongoDB Atlas, couldnt figure out a better way. CORS issues came back from assignment 1 but at least we knew how to fix it this time.
