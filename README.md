# OutreachAI - AI-Powered Cold Outreach Platform

OutreachAI is a professional AI-powered cold outreach email generator designed for B2B sales teams, SDRs, and founders. Generate personalized, high-quality outreach emails at scale using Google Gemini AI.

## Features

- **🔐 Authentication**: Secure email/password authentication with NextAuth.js
- **👥 Prospect Management**: Full CRUD operations for managing prospects
- **🤖 AI Email Generation**: Generate personalized emails using Google Gemini 2.0 Flash
- **📊 Dashboard**: Overview stats and analytics (total, contacted, replied, converted)
- **🎯 Status Tracking**: Track prospects from new to converted
- **📝 Email History**: View all generated emails for each prospect
- **🔍 Search & Filter**: Find prospects quickly by name, company, or status
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **✨ Modern UI**: Clean, professional design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini 2.0 Flash API
- **Authentication**: NextAuth.js with credentials provider
- **Deployment**: Vercel-ready

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key ([Get one here](https://ai.google.dev/))

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd outreach-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/outreach_ai?schema=public

# NextAuth.js
NEXTAUTH_SECRET=your-random-secret-string-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Set up the database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Creating an Account

1. Navigate to the registration page
2. Enter your email and password
3. Click "Create account"

### Adding Prospects

1. Log in to your account
2. Click "Add Prospect" from the dashboard or prospects page
3. Fill in the prospect details:
   - Name (required)
   - Company (required)
   - Role/Title (required)
   - Industry (optional)
   - Pain Points/Notes (optional)
   - LinkedIn URL (optional)
   - Email (optional)

### Generating Emails

1. Navigate to a prospect's detail page
2. Click "Generate Email"
3. The AI will create a personalized outreach email
4. Copy the email to your clipboard
5. Edit the email inline if needed
6. Regenerate for different variations

### Managing Prospects

- **Update Status**: Change prospect status (New → Contacted → Replied → Converted)
- **Edit Details**: Update prospect information anytime
- **Search**: Find prospects by name or company
- **Filter**: Filter by status (New, Contacted, Replied, Converted)
- **Delete**: Remove prospects you no longer need

## Project Structure

```
outreach-ai/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   └── prospects/       # Prospect management
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth configuration
│   │   ├── prospects/      # Prospect CRUD APIs
│   │   ├── generate-email/ # Email generation API
│   │   └── register/       # User registration API
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── prospect-form.tsx
│   ├── prospect-list.tsx
│   └── email-generator.tsx
├── lib/                    # Utility functions
│   ├── prisma.ts          # Prisma client
│   ├── gemini.ts          # Gemini AI integration
│   └── auth.ts            # NextAuth configuration
├── prisma/
│   └── schema.prisma      # Database schema
├── types/                 # TypeScript type definitions
├── .env.example          # Example environment variables
└── README.md
```

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User name (optional)
- `createdAt`: Account creation timestamp

### Prospect
- `id`: Unique identifier
- `name`: Prospect name
- `company`: Company name
- `role`: Job title
- `industry`: Industry (optional)
- `painPoints`: Notes about challenges (optional)
- `linkedinUrl`: LinkedIn profile URL (optional)
- `email`: Contact email (optional)
- `status`: Current status (new, contacted, replied, converted)
- `userId`: Reference to user
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### GeneratedEmail
- `id`: Unique identifier
- `subject`: Email subject line
- `body`: Email body content
- `prospectId`: Reference to prospect
- `createdAt`: Generation timestamp

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Prospects
- `GET /api/prospects` - Get all prospects for authenticated user
- `POST /api/prospects` - Create new prospect
- `GET /api/prospects/[id]` - Get specific prospect
- `PUT /api/prospects/[id]` - Update prospect
- `DELETE /api/prospects/[id]` - Delete prospect

### Email Generation
- `POST /api/generate-email` - Generate AI email for prospect

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. Configure environment variables in Vercel:
   - Add all variables from `.env.example`
   - Set `NEXTAUTH_URL` to your Vercel domain

4. Deploy!

### Database Setup for Production

For production, you'll need a PostgreSQL database. Recommended options:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

After setting up your production database:
1. Update `DATABASE_URL` in Vercel environment variables
2. Run migrations: `npx prisma migrate deploy`

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Create database migrations
```

### Database Management

View and edit your database with Prisma Studio:

```bash
npx prisma studio
```

Create new migrations after schema changes:

```bash
npx prisma migrate dev --name migration-name
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Protected API routes
- ✅ SQL injection prevention (Prisma)
- ✅ CSRF protection (NextAuth.js)
- ✅ Environment variable validation

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network connectivity

### Gemini API Errors
- Verify `GEMINI_API_KEY` is valid
- Check API quota and limits
- Review error messages in console

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (18+ required)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Roadmap

Future enhancements planned:
- Email template library
- Bulk prospect import (CSV)
- Team collaboration features
- Email tracking integration
- A/B testing for email variations
- LinkedIn integration
- Automated follow-ups

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**
