# PlanningMind - AI-Powered Task Planner

An intelligent task planning and scheduling application powered by Google's Gemini AI.

## Features

- 🤖 **AI-Powered Scheduling**: Uses Gemini 2.5 Flash to generate optimal daily schedules
- 📅 **Smart Time Management**: Automatically schedules tasks based on priority and time constraints
- 🔄 **Real-time Sync**: Syncs data across devices using Convex
- 🔐 **Secure Authentication**: User authentication powered by Clerk
- 🌍 **Multi-language**: Supports Vietnamese and English
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Convex
- **Authentication**: Clerk
- **AI**: Google Gemini AI (via @google/genai)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Convex account
- Clerk account
- Google AI Studio API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd productivityflow
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:
- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL
- `CONVEX_DEPLOYMENT`: Your Convex deployment name
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

4. Set up Convex:
```bash
npx convex dev
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting API Keys

#### Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy and save your API key securely

#### Clerk
1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key

#### Convex
1. Visit [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project
3. Follow the setup instructions

## Project Structure

```
productivityflow/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── i18n/            # Internationalization
│   └── lib/             # Utilities and services
│       ├── convex.ts    # Convex client setup
│       ├── types.ts     # TypeScript types
│       └── services/    # Business logic
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── tasks.ts         # Tasks API
│   ├── plans.ts         # Plans API
│   ├── history.ts       # History API
│   └── settings.ts      # Settings API
├── public/              # Static assets
└── middleware.ts        # Next.js middleware (Clerk)
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Next.js.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please file an issue on GitHub.
