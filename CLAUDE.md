# Meta Ads Intelligence Platform - Claude Code Memory

## Project Overview
A comprehensive Meta/Facebook advertising intelligence platform for campaign analysis, competitor research, and automated reporting. Built with modern technologies for enterprise-scale performance and security.

## Project Architecture & Standards

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router (Recently updated - SSRF vulnerability fixed)
- **Language**: TypeScript 5.9.2 with strict mode
- **Runtime**: React 19.1.1 with concurrent features
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Meta OAuth
- **Deployment**: Docker containerization + Vercel/Railway
- **API Integration**: Meta Marketing API, Facebook Graph API
- **State Management**: Zustand + React Query
- **Testing**: Vitest + Playwright for E2E

### Build & Development Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start          # Start production server
npm run typecheck      # TypeScript checking
npm run lint           # ESLint checking

# Database
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes
npx prisma studio      # Open Prisma Studio

# Testing
npm run test           # Run tests
npm run test:e2e       # End-to-end tests

# Docker
docker build -t meta-ads-platform .
docker-compose up -d
```

### API Architecture
- RESTful APIs in `/src/app/api/`
- Authentication endpoints: `/api/auth/[...nextauth]`
- Meta API integration: `/api/meta/`
- Webhook handlers: `/api/webhooks/`
- Health checks: `/api/health/`

### Database Schema Patterns
```prisma
// User management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  accounts  Account[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Meta Ad Account integration
model AdAccount {
  id            String @id
  name          String
  accountId     String
  accessToken   String
  userId        String
  user          User   @relation(fields: [userId], references: [id])
}
```

### Component Architecture
- Page components in `/src/app/`
- Reusable components in `/src/components/`
- UI primitives in `/src/components/ui/`
- Layout components in `/src/components/layout/`
- Feature-specific components organized by domain

### State Management
- Server state with React Query/TanStack Query
- Client state with Zustand for complex state
- Form state with React Hook Form + Zod validation
- Authentication state through NextAuth session

### Environment Configuration
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Meta API
META_APP_ID="..."
META_APP_SECRET="..."
META_VERIFY_TOKEN="..."

# Production
NODE_ENV="production"
```

### Error Handling Patterns
- API error responses with proper HTTP status codes
- Client-side error boundaries for component failures
- Logging with structured data for monitoring
- Graceful fallbacks for failed API calls

### Security Implementation
- CSRF protection through NextAuth
- Rate limiting on API endpoints (Meta API: 200 calls/hour per user)
- Input validation with Zod schemas
- Secure headers configuration
- Environment variable validation
- Meta Business verification required for production
- Webhook signature verification
- API key rotation and secure storage

### Recent Security Updates (2025-09-10)
- ✅ Next.js updated from 15.4.5 → 15.5.2 (SSRF vulnerability patched)
- ✅ Dependencies security audit completed
- ✅ No exposure to npm supply chain attack (debug/chalk packages)
- ⚠️ Monitoring n8n form-data dependency (critical but not directly exploitable)

### Deployment Configuration
- **Staging**: Vercel (auto-deploy from main branch)
- **Production**: Railway with PostgreSQL database
- Multi-stage Docker builds for optimization
- Nginx reverse proxy configuration
- Health check endpoints for monitoring
- Container orchestration with docker-compose
- Production environment variable management
- CDN: Vercel Edge Network for global performance

### Performance Targets & Monitoring
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **API Response**: < 500ms average
- **Cache Hit Ratio**: > 90% for static assets
- **Error Tracking**: Sentry integration
- **Analytics**: Vercel Analytics + custom KPIs

### Meta API Integration Best Practices
- **Rate Limiting**: Implement exponential backoff
- **Token Management**: Automatic refresh with error handling
- **Business Verification**: Required for advanced permissions
- **Webhook Security**: Verify signatures and implement idempotency
- **Data Privacy**: GDPR-compliant data handling and retention
- **Error Handling**: Comprehensive Facebook API error responses

### Development Workflow
- **Hooks**: Automated security checks, linting, and quality gates
- **Sub-agents**: Specialized Claude Code agents for architecture, API integration, security, and performance
- **Output Style**: "automation-expert" for production-ready code patterns
- **Testing**: Comprehensive test coverage with CI/CD integration
- **Code Quality**: TypeScript strict mode, ESLint, Prettier automation

### Key Features & Capabilities
- **Campaign Intelligence**: Real-time performance tracking and optimization
- **Competitor Analysis**: Automated competitor ad monitoring and insights
- **Creative Analytics**: Ad creative performance analysis and recommendations
- **Automated Reporting**: Scheduled reports and intelligent alerts
- **Multi-Account Management**: Agency-level account and permission management
- **Real-time Dashboards**: Live campaign metrics and visualization

### Future Roadmap
- [ ] AI-powered campaign optimization suggestions
- [ ] Advanced competitor analysis with machine learning
- [ ] White-label solution for agencies
- [ ] Mobile app development
- [ ] Advanced analytics with D3.js visualizations
- [ ] AI-powered creative generation and testing tools