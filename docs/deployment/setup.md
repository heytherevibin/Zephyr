# Deployment Guide

This guide covers the deployment process for the Zephyr Chat Widget and its backend services.

## Prerequisites

- Node.js 18.x or later
- MongoDB 6.0 or later
- Redis 7.0 or later
- Docker (optional)
- SSL certificate

## Environment Setup

1. Create a `.env` file in the root directory:

```env
# App
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com

# Database
MONGODB_URI=mongodb://username:password@host:port/database
REDIS_URL=redis://username:password@host:port

# Authentication
JWT_SECRET=your-jwt-secret
API_KEY_SALT=your-api-key-salt

# Storage
S3_BUCKET=your-bucket-name
S3_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email (optional)
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Database Setup

1. Create MongoDB database and user:

```bash
mongosh admin -u admin -p

use zephyr
db.createUser({
  user: "zephyr",
  pwd: "your-password",
  roles: ["readWrite", "dbAdmin"]
})
```

2. Create required indexes:

```bash
db.messages.createIndex({ conversationId: 1, createdAt: -1 })
db.apiKeys.createIndex({ key: 1 }, { unique: true })
db.customers.createIndex({ email: 1 }, { unique: true })
```

## Backend Deployment

### Using Docker

1. Build the Docker image:

```bash
docker build -t zephyr-api .
```

2. Run the container:

```bash
docker run -d \
  --name zephyr-api \
  --env-file .env \
  -p 3000:3000 \
  zephyr-api
```

### Manual Deployment

1. Install dependencies:

```bash
npm install --production
```

2. Build the application:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

## Frontend Deployment

1. Update the API endpoint in your environment configuration:

```typescript
// src/config/env.ts
export const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
  // ...other config
};
```

2. Build the frontend:

```bash
npm run build
```

3. Deploy the static files to your hosting service (e.g., Vercel, Netlify, or AWS S3).

## Nginx Configuration

If using Nginx as a reverse proxy:

```nginx
server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

1. Set up health checks:

```bash
curl https://api.your-domain.com/health
```

2. Configure monitoring tools:
   - New Relic
   - Datadog
   - Prometheus + Grafana

3. Set up logging:
   - ELK Stack
   - Papertrail
   - CloudWatch

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] API keys properly secured
- [ ] Rate limiting configured
- [ ] CORS settings verified
- [ ] Input validation implemented
- [ ] Error handling configured
- [ ] Audit logging enabled
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Security headers set

## Backup Strategy

1. Database backups:

```bash
# Daily backups
mongodump --uri="mongodb://username:password@host:port/database" --out=/backup/$(date +%Y%m%d)

# Rotate backups older than 30 days
find /backup -type d -mtime +30 -exec rm -rf {} +
```

2. File storage backups:

```bash
# Sync S3 bucket to backup location
aws s3 sync s3://your-bucket-name /backup/s3/$(date +%Y%m%d)
```

## Scaling Considerations

1. Horizontal scaling:
   - Use container orchestration (Kubernetes)
   - Configure load balancers
   - Implement session management

2. Database scaling:
   - MongoDB replication
   - Redis clustering
   - Connection pooling

3. File storage:
   - CDN integration
   - Multi-region replication
   - Cache optimization

## Troubleshooting

Common issues and solutions:

1. Connection timeouts:
   - Check network configuration
   - Verify firewall rules
   - Monitor resource usage

2. High memory usage:
   - Review memory limits
   - Check for memory leaks
   - Optimize database queries

3. Slow performance:
   - Monitor database indexes
   - Check API response times
   - Review caching strategy

## Maintenance

Regular maintenance tasks:

1. Daily:
   - Monitor error logs
   - Check system health
   - Review security alerts

2. Weekly:
   - Update dependencies
   - Review performance metrics
   - Backup verification

3. Monthly:
   - Security patches
   - SSL certificate check
   - Resource scaling review

## Support

For additional support:

- Documentation: https://docs.zephyr.chat
- GitHub Issues: https://github.com/zephyr/chat-widget/issues
- Email: support@zephyr.chat 