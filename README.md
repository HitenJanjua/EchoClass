# EchoClass

EchoClass is an AI-powered classroom management and doubt-solving platform. 

## Tech Stack
- Next.js (App Router)
- React
- Prisma
- Neon Serverless Postgres
- NextAuth.js (Google OAuth)
- Google Gemini API (for AI doubt answering and quiz generation)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
