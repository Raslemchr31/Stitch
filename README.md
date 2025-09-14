# 🚀 Meta Ads Intelligence Platform v2.0

A comprehensive, real-time Meta/Facebook advertising intelligence platform for campaign analysis, competitor research, and automated reporting.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Raslemchr31/Stitch.git)

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**: Secure Facebook OAuth integration
- **Dashboard Layout**: Modern, responsive dashboard with collapsible sidebar
- **Analytics Dashboard**: Interactive charts and performance metrics using Recharts
- **Campaign Management**: Complete CRUD operations for ad campaigns
- **Page Connection Wizard**: Multi-step form for connecting Facebook pages
- **Competitor Research**: AI-powered competitor analysis and insights
- **Real-time Updates**: Live campaign performance monitoring

### Technical Features
- **Next.js 14+** with App Router and TypeScript
- **ShadCN/UI** components for consistent design system
- **TailwindCSS** for responsive, mobile-first styling
- **React Query/TanStack Query** for efficient API state management
- **Zustand** for global state management
- **React Hook Form** with Zod validation
- **NextAuth.js** for authentication
- **Recharts** for interactive data visualizations

### UI/UX Features
- **Dark/Light Mode** with system preference detection
- **Responsive Design** optimized for all screen sizes
- **Loading States** with skeleton components
- **Error Boundaries** for graceful error handling
- **Accessibility** WCAG compliant components
- **Smooth Animations** and hover effects

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadCN/UI components
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js (Facebook OAuth)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd meta-ads-intelligence-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy `.env.local` and configure your environment variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── api/                  # API routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # ShadCN/UI components
│   ├── layout/               # Layout components
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard components
│   ├── analytics/            # Analytics components
│   ├── campaigns/            # Campaign components
│   ├── competitor-research/  # Competitor research components
│   └── forms/                # Form components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and configurations
├── store/                    # Zustand stores
├── types/                    # TypeScript type definitions
└── api/                      # API client and utilities
```

## 🔧 Key Components

### Authentication
- **Facebook OAuth** integration with NextAuth.js
- **Protected routes** with session management
- **Error handling** for authentication failures

### Dashboard Layout
- **Responsive sidebar** with collapsible navigation
- **Header** with user profile, notifications, and theme toggle
- **Breadcrumb navigation** for better UX

### Analytics Dashboard
- **Performance metrics** cards with trend indicators
- **Interactive charts** using Recharts (Line, Bar, Area, Pie)
- **Date range filtering** and data export functionality
- **Real-time updates** for live campaign monitoring

### Campaign Management
- **Campaign creation wizard** with AI suggestions
- **Performance monitoring** with detailed metrics
- **Bulk operations** for managing multiple campaigns
- **A/B testing** results visualization

### State Management
- **Auth Store**: User authentication and Facebook pages
- **App Store**: UI state, notifications, and preferences
- **Campaign Store**: Campaign data and filtering

## 🎨 Design System

The application uses ShadCN/UI components built on top of Radix UI primitives:

- **Colors**: Semantic color system with dark mode support
- **Typography**: Consistent font scales and line heights
- **Spacing**: 8px grid system
- **Components**: Reusable, accessible components
- **Animations**: Smooth transitions and micro-interactions

## 📱 Responsive Design

- **Mobile-first** approach with TailwindCSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interactions for mobile devices
- **Optimized layouts** for different screen sizes

## 🚀 Performance Optimizations

- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** for identifying optimization opportunities
- **Caching strategies** with React Query
- **Lazy loading** for large datasets

## 🔒 Security Features

- **OAuth 2.0** authentication with Facebook
- **CSRF protection** with NextAuth.js
- **Secure headers** configuration
- **Environment variable** protection
- **XSS prevention** with proper data sanitization

## 📊 Analytics & Monitoring

- **Performance metrics** tracking
- **Error tracking** and logging
- **User analytics** integration ready
- **Real-time monitoring** capabilities

## 🧪 Testing (To Be Implemented)

- **Unit tests** with Jest and React Testing Library
- **Integration tests** for API interactions
- **E2E tests** with Playwright
- **Component testing** with Storybook

## 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers

## 📝 API Integration

The frontend is designed to work with a Facebook Graph API backend:

- **TypeScript API client** for type-safe requests
- **React Query** for caching and synchronization
- **Error handling** with retry logic
- **Optimistic updates** for better UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using modern web technologies for the best Facebook advertising intelligence experience.