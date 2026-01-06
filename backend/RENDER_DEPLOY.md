# Render Deployment Guide for FocusFlow Backend

## Quick Start

### 1. Create Render Account
Go to https://render.com and sign up

### 2. Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `focusflow-db`
3. Database: `focusflow`
4. User: `focusflow`
5. Region: Oregon (US West)
6. Plan: Free
7. Click "Create Database"

**Important**: Save the connection details!

### 3. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `focusflow-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `./start.sh`
   - **Plan**: Free

### 4. Set Environment Variables

In the Render dashboard, go to "Environment" and add:

```bash
# Database (from PostgreSQL database)
DATABASE_URL=postgresql+asyncpg://user:password@host/database

# CORS (your frontend URL)
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Environment
ENVIRONMENT=production

# Optional
PROJECT_NAME=FocusFlow
API_V1_PREFIX=/api/v1
```

**Critical**: Make sure `DATABASE_URL` uses `postgresql+asyncpg://` not `postgresql://`

### 5. Deploy

Click "Manual Deploy" or push to main branch.

## Troubleshooting

### Error: ModuleNotFoundError: No module named 'psycopg2'

**Solution**: Already fixed in `requirements.txt` - includes `psycopg2-binary`

### Error: ModuleNotFoundError: No module named 'src'

**Solution**: Use the provided `start.sh` script which sets PYTHONPATH

**Alternative**: Set environment variable in Render:
```
PYTHONPATH=/opt/render/project/src/backend
```

### Error: Database connection failed

**Check**:
1. DATABASE_URL format: `postgresql+asyncpg://...`
2. Database is running
3. Connection string is correct
4. No firewall blocking

### Error: CORS issues

**Check**:
1. `ALLOWED_ORIGINS` includes your frontend URL
2. URL includes protocol (https://)
3. No trailing slash

## Environment Variables Reference

### Required

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@host/db` | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | `https://app.vercel.app` | Frontend URLs (comma-separated) |
| `ENVIRONMENT` | `production` | Environment name |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `PROJECT_NAME` | `FocusFlow` | API title |
| `API_V1_PREFIX` | `/api/v1` | API prefix |
| `PYTHONPATH` | Auto-set | Python module search path |

## Render Configuration Files

### render.yaml (optional)

Create `backend/render.yaml` for infrastructure as code:

```yaml
services:
  - type: web
    name: focusflow-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: ./start.sh
```

### start.sh

Already created - sets PYTHONPATH and starts the server.

Make it executable:
```bash
chmod +x backend/start.sh
```

## Database URL Format

Render provides URLs in this format:
```
postgresql://user:password@host:5432/database
```

**You MUST change it to**:
```
postgresql+asyncpg://user:password@host:5432/database
```

## Health Check

After deployment, test:
```bash
curl https://your-app.onrender.com/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "FocusFlow API",
  "version": "0.1.0"
}
```

## Logs

View logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Watch for errors

Common success messages:
```
INFO:     Uvicorn running on http://0.0.0.0:10000
INFO:     Application startup complete.
```

## Deployment Checklist

- [ ] PostgreSQL database created
- [ ] DATABASE_URL set (with asyncpg)
- [ ] ALLOWED_ORIGINS set
- [ ] ENVIRONMENT=production
- [ ] start.sh is executable
- [ ] Health check passes
- [ ] Frontend can connect

## Next Steps

1. Deploy frontend (Vercel/Netlify)
2. Update ALLOWED_ORIGINS with frontend URL
3. Test full integration
4. Set up custom domain (optional)

## Support

- Render Docs: https://render.com/docs
- Project Issues: https://github.com/unnalin/FocusFlow/issues
