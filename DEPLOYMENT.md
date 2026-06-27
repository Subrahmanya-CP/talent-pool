# Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- Supabase account and project
- Groq API key
- Node.js 18+ installed locally

## Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in Supabase dashboard
3. Run the schema from `supabase/schema.sql`
4. Get your credentials:
   - Project URL
   - anon key
   - service_role key

## AWS S3 Setup

1. Create an S3 bucket in AWS Console
2. Configure bucket settings:
   - Block public access: On (recommended)
   - Versioning: Optional
3. Create IAM user with S3 write permissions
4. Get credentials:
   - Access Key ID
   - Secret Access Key
   - Region
   - Bucket name

## Groq API Setup

1. Get API key from https://groq.com
2. Add to environment variables

## Backend Deployment (Elastic Beanstalk)

### 1. Configure Environment Variables

In Elastic Beanstalk Console → Configuration → Software:
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET=your_s3_bucket_name
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=your_frontend_url
```

### 2. Deploy via CLI

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init talent-pool-backend

# Create environment
eb create production

# Deploy
eb deploy
```

### 3. Deploy via Console

1. Create new application in Elastic Beanstalk
2. Platform: Node.js 18+
3. Upload backend folder as zip (excluding node_modules)
4. Configure environment variables
5. Deploy

## Frontend Deployment (Amplify)

### 1. Configure Environment Variables

In Amplify Console → App settings → Environment variables:
```
VITE_API_URL=your_backend_api_url
```

### 2. Deploy via CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

### 3. Deploy via Console

1. Create new app in Amplify Console
2. Connect to GitHub repository
3. Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
4. Deploy

## Post-Deployment Checklist

- [ ] Test health endpoint: `GET /health`
- [ ] Test resume upload with PDF
- [ ] Test resume upload with DOCX
- [ ] Verify candidate search works
- [ ] Check S3 bucket for uploaded files
- [ ] Verify Supabase database has candidate records
- [ ] Test candidate details page
- [ ] Verify CORS is configured correctly
- [ ] Check error logs in CloudWatch (backend)
- [ ] Check build logs in Amplify (frontend)

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Rotate keys regularly
3. **S3 Bucket**: Keep private, use presigned URLs if needed
4. **Supabase**: Use service_role key only on backend
5. **Rate Limiting**: Adjust based on traffic patterns
6. **HTTPS**: Enable SSL/TLS on both frontend and backend

## Monitoring

- **Backend**: CloudWatch Logs and Metrics
- **Frontend**: Amplify Console logs
- **Database**: Supabase Dashboard logs
- **S3**: CloudTrail for access logs

## Scaling

### Backend (Elastic Beanstalk)
- Auto-scaling groups
- Load balancer
- RDS for database (if needed)

### Frontend (Amplify)
- CDN distribution
- Cache settings
- Global edge locations

## Troubleshooting

### Backend Issues
- Check CloudWatch logs
- Verify environment variables
- Test database connection
- Check S3 permissions

### Frontend Issues
- Check build logs
- Verify API URL
- Test CORS configuration
- Check browser console for errors

## Cost Optimization

- Use S3 lifecycle policies for old files
- Enable CloudFront caching
- Monitor API usage (Groq)
- Set up AWS Budgets
- Use reserved instances for long-running workloads
