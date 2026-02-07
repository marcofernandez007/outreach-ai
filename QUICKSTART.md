# OutreachAI - Quick Start Guide

This guide will help you get OutreachAI up and running on your local machine in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google Gemini API key

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd outreach-ai
npm install
```

## Step 2: Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/outreach_ai"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

## Step 3: Set Up Database

Run Prisma migrations to create your database schema:
```bash
npx prisma migrate dev --name init
```

This will create the necessary tables: `User`, `Prospect`, and `GeneratedEmail`.

## Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Create Your Account

1. Click "Get Started" or "Sign Up"
2. Enter your email and password
3. Click "Create account"
4. You'll be redirected to login
5. Sign in with your credentials

## Step 6: Add Your First Prospect

1. From the dashboard, click "+ Add Prospect"
2. Fill in the prospect details:
   - Name (required)
   - Company (required)
   - Role/Title (required)
   - Industry (optional)
   - Pain Points/Notes (optional)
3. Click "Add Prospect"

## Step 7: Generate Your First Email

1. Click on a prospect to view details
2. Click "Generate Email"
3. Wait for AI to generate personalized email
4. Copy to clipboard and use!

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Gemini API Error
- Verify API key is correct
- Check you have API quota
- Ensure GEMINI_API_KEY in .env

### Build Errors
- Delete .next folder: `rm -rf .next`
- Reinstall: `npm install`
- Rebuild: `npm run build`

## Next Steps

- Customize email prompts in `lib/gemini.ts`
- Adjust UI colors in `app/globals.css`
- Add more prospect fields as needed
- Deploy to Vercel (see README.md)

## Getting Help

- Check the main README.md for detailed documentation
- Review the code comments
- Open an issue on GitHub

---

Enjoy using OutreachAI! 🚀
