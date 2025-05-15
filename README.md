# Anonymous Social Messaging Platform

A modern anonymous messaging platform inspired by Qooh.me that lets users receive anonymous messages from others via a public profile link. This project features AI-powered message suggestions, robust authentication, and a clean, responsive UI built with Next.js and React.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Authentication](#authentication)
- [AI Message Suggestions](#ai-message-suggestions)
- [Contributing](#contributing)

---

## Demo

> Live Demo Here: https://mystery-message.ayushsoni.dev/

---

## Features

- **Anonymous messaging**: Send messages anonymously to users via their public profile link.
- **AI-powered message suggestions**: Get smart, engaging question suggestions powered by Google’s generative AI.
- **User authentication**: Secure sign-up, login, and session management with NextAuth.js.
- **Real-time UI feedback**: Loading states, validation, and toast notifications for smooth UX.
- **Fallback suggestions**: Default fallback questions in case AI suggestions fail.

---

## Tech Stack

- **Next.js 15** (App Router) with React
- **NextAuth.js** for authentication
- **Mongoose & MongoDB** for database
- **React Hook Form + Zod** for form validation
- **Sonner** for toast notifications
- **Google Gemini AI** for message suggestion generation
- **Tailwind CSS** for styling
- **Lucide Icons** for UI icons

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB connection URI
- Google Generative AI API Key

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/AyushSoni86/mystery-message-nextjs.git
   cd mystery-message-nextjs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Setup environment variables (`.env.local`):

   ```env
   MONGO_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   RESEND_API_KEY=your_resend_api_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
   NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## Project Structure

```
/app
  /api
    /auth/[...nextauth]         # Authentication API routes
    /send-message               # API route for sending messages
    /suggest-messages           # AI-powered message suggestion API
  /components                   # Reusable UI components (Form, Button, Card, etc.)
  /schemas                     # Validation schemas (Zod)
  /models                      # Mongoose models (User, Message)
  /lib                         # Database connection and helpers
  /pages                       # Next.js pages if any (optional)
```

---

## Usage

- Visit a user's public profile link (e.g., `/u/username`) to send them anonymous messages.
- Use the message input or click suggested AI-generated questions.
- If you are unauthenticated, a "Create Your Account" button appears to encourage sign-up.
- Users cannot send messages to themselves.
- Messages are stored and displayed securely after authentication.

---

## Authentication

- Powered by **NextAuth.js**, supporting OAuth providers and email sign-in.
- Sessions are validated server-side for secure API access.
- Implements email verification by sending a 6-digit verification code via email upon signup.
- Email sending is powered by Resend, a utility for reliable email delivery.
- Only authenticated users can read messages on their profile.

---

## AI Message Suggestions

- Integrated with **Google Gemini AI** via streaming API.
- Generates engaging, open-ended questions separated by `||`.
- Suggestions can be refreshed on-demand.
- Falls back to default messages if AI suggestions fail.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
