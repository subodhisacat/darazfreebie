# daraz freebie Platform

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

## Vercel Deploy Trigger

This small update is used to trigger a fresh Vercel deployment for diagnosing build issues. After this deploy finishes, check the Vercel project deployment logs and paste the final error lines here if it still fails.

## Deploying to Vercel (recommended workflow)

Follow these steps to deploy securely and avoid committing secrets to the repo.

1) Create a Vercel Personal Token
   - Open https://vercel.com/account/tokens and create a **Personal Token** with the `Read & Write` scope for your team.
   - Copy the token; you'll add it to GitHub Secrets.

2) Add GitHub Secrets to your repository
   - Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
   - Add these three secrets:
     - `VERCEL_TOKEN` — the Vercel personal token you created
     - `NEXT_PUBLIC_SUPABASE_URL` — `https://onexidyexeympdttdwlq.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public key

3) Confirm the repository contains `.github/workflows/deploy-to-vercel.yml`
   - This repository includes a workflow that will build and deploy to Vercel when you push to `main`.

4) Push to `main` (or create a test commit)
   - The GitHub Actions workflow will run, build the app using the secrets (without exposing them in the repo), try to set Vercel project envs, and deploy to production.

5) Disable Deployment Protection in Vercel (if enabled)
   - If visiting the production URL redirects you to a Vercel authentication page, open the Vercel dashboard:
     - https://vercel.com/dashboard → select team `Subodh 's projects` → project `darazfreebie-jqbd` → Settings → Access & Privacy (or Deployment Protection).
     - Turn off any toggle that requires authentication or protection for deployments. Save changes.

6) Re-deploy (if needed)
   - After changing settings, re-run the workflow by pushing another commit or use the Vercel dashboard to redeploy the latest commit.

7) Verify the production URL
   - Open: `https://darazfreebie-jqbd-mp1g7ay6q-subodh-s-projects.vercel.app`
   - You should see your app (not Vercel auth page) once protection is off and the successful deployment completed.

Security notes
- Do NOT commit `.env.local` or any real keys to the repository. Use `.env.example` for documentation.
- Rotate the Supabase anon key or Vercel token if you suspect they've been exposed.

