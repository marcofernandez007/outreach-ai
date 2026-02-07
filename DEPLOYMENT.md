# Deployment Guide - Vercel

This guide walks you through deploying OutreachAI to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- PostgreSQL database (we recommend Vercel Postgres or Neon)
- Google Gemini API key

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the connection string

### Option B: Neon (Free Alternative)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new Postgres database
3. Copy the connection string

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

## Step 4: Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-app.vercel.app
GEMINI_API_KEY=your-gemini-api-key
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 5: Run Database Migrations

After deployment, you need to run migrations. You have two options:

### Option A: From Local Machine

1. Update your local `.env` with production DATABASE_URL
2. Run migrations:
```bash
npx prisma migrate deploy
```

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Run migrations:
```bash
vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npx prisma migrate deploy
```

## Step 6: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Create a test account
3. Add a test prospect
4. Generate an email

## Step 7: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Can create an account
- [ ] Can login
- [ ] Can add prospects
- [ ] AI generates emails
- [ ] All pages load properly
- [ ] Mobile view works
- [ ] No console errors

## Monitoring

Vercel provides built-in analytics:
- Real-time logs
- Performance metrics
- Error tracking

Access these in your Vercel dashboard.

## Updating Your Deployment

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy when you push to the main branch.

## Troubleshooting

### Build Failed

Check Vercel logs for specific errors. Common issues:
- Missing environment variables
- TypeScript errors
- Database connection issues

### Can't Connect to Database

- Verify DATABASE_URL is correct
- Check database is accessible from Vercel's network
- Verify SSL settings if required

### Authentication Not Working

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure it's https:// for production

### Gemini API Errors

- Verify API key is valid
- Check API quota limits
- Review error messages in logs

## Scaling

For production use with higher traffic:

1. **Database**: Upgrade to a paid plan with more connections
2. **Vercel**: Consider Pro plan for better performance
3. **Caching**: Add Redis for session storage
4. **CDN**: Vercel handles this automatically

## Security Best Practices

- ✅ Use strong NEXTAUTH_SECRET (32+ characters)
- ✅ Enable database connection pooling
- ✅ Set up proper CORS if needed
- ✅ Monitor API usage and set limits
- ✅ Regular security updates: `npm update`

## Cost Estimates

### Free Tier (Good for MVP/Testing)
- Vercel: Free (100GB bandwidth, 100 serverless executions)
- Neon Postgres: Free (1 database, 512MB)
- Total: $0/month

### Production (Small Business)
- Vercel Pro: $20/month
- Vercel Postgres: $20/month (256MB)
- or Neon Pro: $19/month
- Total: $40-60/month

---

You're all set! Your OutreachAI app is now live! 🚀

For questions or issues, please open an issue on GitHub.
