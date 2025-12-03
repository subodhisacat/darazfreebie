# Token Ad Platform

A web application where users can earn and spend tokens by viewing and creating advertisements.

## Features

- **User Authentication**: Secure sign-up and login using Supabase Auth
- **Token System**: Users start with 10 tokens
  - Earn 1 token per ad view
  - Earn 5 tokens per ad click
  - Spend tokens to create ads
- **Ad Management**: Create, view, and track advertisements
- **Real-time Updates**: Token balance updates instantly
- **Profile Management**: View your profile and token balance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### profiles
- `id` (UUID, PK): User ID from auth.users
- `username` (text): User's display name
- `tokens` (int): Current token balance (default: 10)

### ads
- `id` (bigint, PK): Auto-generated
- `user_id` (UUID, FK): Creator of the ad
- `title` (text): Ad title
- `description` (text): Ad description
- `link` (text): URL to visit on click
- `tokens_spent` (int): Tokens spent on this ad
- `created_at` (timestamp): Creation time

### ad_interactions
- `id` (bigint, PK): Auto-generated
- `ad_id` (bigint, FK): Referenced ad
- `user_id` (UUID, FK): User who interacted
- `type` (text): 'view' or 'click'
- `created_at` (timestamp): Interaction time

## Routes

- `/` - Home page with overview
- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- `/ads` - Browse and earn from ads
- `/dashboard` - Create and manage your ads
- `/profile` - View your profile and tokens

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Earn Tokens**: Browse ads and earn tokens by viewing and clicking
3. **Create Ads**: Go to dashboard, click "Create New Ad", fill in details and spend tokens
4. **Monitor**: Track your token balance in the navbar

## Features Breakdown

### Earning Tokens
- View ads: +1 token (limited to once per user per ad)
- Click links: +5 tokens (limited to once per user per ad)

### Spending Tokens
- Create ads with custom budget
- More tokens = potentially more visibility
- Track ad performance in dashboard

### Safety Features
- Users can only earn from each ad once
- All transactions are recorded
- User tokens are tracked in real-time

## Future Enhancements

- Ad statistics and analytics
- Token top-up system
- Ad categories and filtering
- Advanced targeting options
- User ratings and reputation system
