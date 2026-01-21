# 🐱 CatHub - MBA Tools Powered by AI

Your one-stop destination for AI-powered MBA application tools. From SOPs to interview prep, we've got you covered.

![CatHub](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square)

## ✨ Features

- **MBA Writer** - Generate compelling SOPs, essays, and application responses
- **Interview Prep** (Coming Soon) - AI-powered mock interviews
- **Essay Review** (Coming Soon) - Get AI feedback on your essays

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cathub
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to **Settings > API**
3. Copy your **Project URL** and **anon public** key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication > URL Configuration**
2. Add `http://localhost:3000` to **Site URL**
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

For Google OAuth (optional):
1. Go to **Authentication > Providers**
2. Enable Google provider
3. Add your Google OAuth credentials

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/       # OAuth callback handler
│   ├── dashboard/
│   │   ├── mba-writer/     # MBA Writer tool
│   │   └── page.tsx        # Dashboard home
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── DashboardNav.tsx    # Dashboard navigation
│   ├── Footer.tsx          # Footer component
│   └── Navbar.tsx          # Main navigation
├── lib/
│   └── supabase/
│       ├── client.ts       # Browser Supabase client
│       └── server.ts       # Server Supabase client
└── middleware.ts           # Auth middleware
```

## 🎨 Design

- **Theme**: Modern black and white minimalist design
- **Fonts**: Syne (headings) + Outfit (body)
- **UI**: Clean, spacious, with subtle animations

## 🔐 Authentication

The app uses Supabase for authentication with support for:
- Email/Password sign up and login
- Google OAuth (optional)
- Protected routes via middleware

## 📝 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ for MBA aspirants
