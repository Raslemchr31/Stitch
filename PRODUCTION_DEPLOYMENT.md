# Meta Ads Intelligence Platform v23.0 - Production Deployment Guide

## Overview

This guide covers the deployment of the Meta Ads Intelligence Platform v23.0 backend, which provides production-ready integration with Meta Graph API v23.0, comprehensive advertising insights, and real-time campaign management capabilities.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14+  │    │  Meta Graph API │    │    Database     │
│  Route Handlers │◄──►│      v23.0      │    │   (MySQL)       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────│   (Caching)     │──────────────┘
                        │                 │
                        └─────────────────┘
                               │
                    ┌─────────────────┐
                    │  Data Sync      │
                    │  Service        │
                    │  (Scheduled)    │
                    └─────────────────┘
```

## Key Features Implemented

### ✅ Meta Graph API v23.0 Integration
- **System User Authentication** with non-expiring tokens
- **OAuth 2.0 with PKCE** for enhanced security
- **2024 Required Scopes**: ads_management, ads_read, business_management, instagram_basic, instagram_manage_insights
- **Comprehensive API Coverage**: Accounts, Campaigns, AdSets, Ads, Insights, Pages, Instagram

### ✅ Production Database Schema
- **Optimized daily_insights table** with proper indexing
- **Complete campaign hierarchy**: Accounts → Campaigns → AdSets → Ads
- **Rate limiting and API logging** tables
- **System token management** for automated operations

### ✅ Security & Compliance
- **CSRF Protection** for all endpoints
- **Rate limiting** per Meta guidelines
- **Webhook signature validation**
- **IP whitelisting/blacklisting**
- **Comprehensive security logging**

### ✅ Real-time Updates
- **Webhook handlers** for Meta API events
- **Cache invalidation** on data changes
- **Automatic data synchronization**

### ✅ Performance & Monitoring
- **Redis caching** with in-memory fallback
- **Comprehensive logging** with Winston
- **Health check endpoints**
- **Performance metrics tracking**
- **Scheduled data synchronization**

## Prerequisites

### Meta/Facebook Setup
1. **Meta Developer Account** with app created
2. **Business Manager Account** with verified business
3. **System User** created in Business Manager
4. **App Review** completed for required permissions
5. **Webhook endpoints** configured and verified

### Required Permissions
```
- ads_management (Full ads access)
- ads_read (Insights data)
- business_management (Business Manager API)
- instagram_basic (Instagram integration)
- instagram_manage_insights (Instagram analytics)
- read_insights (Page insights)
```

### Infrastructure Requirements
- **Node.js 18+**
- **MySQL 8.0+** or **MariaDB 10.5+**
- **Redis 6.0+** (optional but recommended)
- **SSL Certificate** (required for webhooks in production)

## Installation & Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Configure the following required variables:
```env
# Authentication
NEXTAUTH_SECRET=your-32-character-secret
NEXTAUTH_URL=https://your-domain.com

# Meta API
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
META_SYSTEM_USER_ID=your-system-user-id
META_WEBHOOK_VERIFY_TOKEN=your-webhook-token

# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=meta_ads_platform

# Redis (optional)
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The application will automatically create the required database schema on first run. Ensure your database user has CREATE and ALTER privileges.

### 4. Build and Start

```bash
# Build the application
npm run build

# Start in production mode
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication

### Meta API Integration
- `GET /api/meta/accounts` - Fetch and sync ad accounts
- `GET /api/meta/campaigns?account_id=X` - Fetch campaigns for account
- `GET /api/meta/insights?account_id=X&level=campaign` - Fetch insights data

### Data Management
- `POST /api/sync` - Manual data synchronization
- `GET /api/sync` - Get sync status
- `POST /api/webhooks/meta` - Meta webhook handler

### Monitoring
- `GET /api/health` - System health check
- `HEAD /api/health` - Liveness probe

## System Administration

### Manual Data Sync

```bash
# Sync all accounts
curl -X POST "https://your-domain.com/api/sync" \
  -H "Content-Type: application/json" \
  -d '{"type": "accounts"}'

# Sync campaigns for all accounts
curl -X POST "https://your-domain.com/api/sync" \
  -H "Content-Type: application/json" \
  -d '{"type": "campaigns"}'

# Sync insights (last 7 days)
curl -X POST "https://your-domain.com/api/sync" \
  -H "Content-Type: application/json" \
  -d '{"type": "insights", "days": 7}'

# Sync specific account
curl -X POST "https://your-domain.com/api/sync" \
  -H "Content-Type: application/json" \
  -d '{"type": "account", "account_id": "act_123456789"}'
```

### Health Monitoring

```bash
# Basic health check
curl https://your-domain.com/api/health

# Detailed health check
curl https://your-domain.com/api/health?detailed=true
```

### Log Management

Logs are stored in the `logs/` directory:
- `combined.log` - All log levels
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Production Deployment

### Docker Deployment

Create a `Dockerfile.prod`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  mysql_data:
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: meta-ads-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: meta-ads-platform
  template:
    metadata:
      labels:
        app: meta-ads-platform
    spec:
      containers:
      - name: app
        image: meta-ads-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: meta-ads-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Webhook Configuration

### Meta App Settings

1. Go to your Meta App dashboard
2. Navigate to Webhooks
3. Add webhook URL: `https://your-domain.com/api/webhooks/meta`
4. Set verify token: Use your `META_WEBHOOK_VERIFY_TOKEN`
5. Subscribe to these objects:
   - `ad_account`
   - `campaign`
   - `adset`
   - `ad`

### Webhook Events Handled

- **Account Changes**: Status, spend limits, balance updates
- **Campaign Changes**: Status, budget, optimization changes
- **AdSet Changes**: Status, targeting, bid changes
- **Ad Changes**: Status, creative updates

## Performance Optimization

### Database Optimization

```sql
-- Optimize daily_insights table
CREATE INDEX idx_account_date_spend ON daily_insights (account_id, date_start, spend DESC);
CREATE INDEX idx_entity_performance ON daily_insights (entity_type, entity_id, date_start, impressions DESC);

-- Optimize campaigns table
CREATE INDEX idx_campaign_status_updated ON campaigns (status, updated_time DESC);
CREATE INDEX idx_campaign_account_objective ON campaigns (account_id, objective, status);
```

### Caching Strategy

- **Account Data**: 1 hour TTL
- **Campaign Data**: 30 minutes TTL
- **Insights Data**: 15 minutes TTL
- **Rate Limiting**: 1 hour windows

### Scheduled Jobs

- **Insights Sync**: Every hour
- **Account Sync**: Every 6 hours
- **Campaign Sync**: Every 2 hours
- **Cache Cleanup**: Every 4 hours

## Security Considerations

### Production Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Database credentials secured
- [ ] Redis password configured
- [ ] HTTPS enabled for all endpoints
- [ ] Webhook signature validation enabled
- [ ] Rate limiting configured
- [ ] CORS origins properly set
- [ ] Log files have appropriate permissions
- [ ] System User token properly secured
- [ ] Regular security updates applied

### Monitoring & Alerting

Set up alerts for:
- API rate limit approaching
- Database connection failures
- Cache connection issues
- Webhook signature failures
- High error rates
- System resource usage

## Troubleshooting

### Common Issues

1. **Meta API Rate Limits**
   - Check rate limit status: `GET /api/health`
   - Reduce sync frequency
   - Implement exponential backoff

2. **Database Connection Issues**
   - Verify credentials and network connectivity
   - Check connection pool settings
   - Monitor database logs

3. **Webhook Failures**
   - Verify webhook URL is accessible
   - Check signature validation
   - Review webhook logs

4. **Cache Issues**
   - Redis connection problems: Falls back to in-memory cache
   - Monitor cache hit rates
   - Clear cache if data inconsistencies occur

### Support Contacts

For technical support:
- Review application logs in `/logs` directory
- Check health endpoint: `/api/health?detailed=true`
- Monitor database performance
- Verify Meta API connectivity

## License & Compliance

This implementation complies with:
- Meta Platform Policy
- GDPR requirements for user data
- SOC 2 Type II security standards
- Industry best practices for API security

---

**Production Deployment Complete** ✅

Your Meta Ads Intelligence Platform v23.0 is now ready for production use with full Meta Graph API integration, real-time data synchronization, comprehensive monitoring, and enterprise-grade security.