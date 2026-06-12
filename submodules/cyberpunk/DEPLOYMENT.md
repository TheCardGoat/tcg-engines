# Cyberpunk Mounted Simulator - Deployment Guide

This guide covers building and deploying the Cyberpunk simulator route with the
multi-game simulator host using Docker and Railway.

## Local Docker Development

### Build the Docker image

```bash
docker build -t cyberpunk-simulator:latest .
```

The multi-stage build will:

1. Install dependencies
2. Build all workspace packages (`pnpm exec vp run build:libs`)
3. Build the multi-game simulator app mounted at `/cyberpunk/simulator`
4. Create a minimal runtime image with only the built files

### Run the container locally

```bash
docker run -p 3000:3000 cyberpunk-simulator:latest
```

Then open http://localhost:3000/cyberpunk/simulator in your browser.

### Test the deployment

```bash
# Health check endpoint
curl http://localhost:3000/health

# Test SPA routing (should serve index.html)
curl http://localhost:3000/cyberpunk/simulator/tests/some-fixture
```

### Run with environment variables (for future use)

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  cyberpunk-simulator:latest
```

## Server Details

The application uses `server.js` to serve static files from the built `dist/` directory:

- **SPA Routing**: All non-file routes fall back to `index.html` to support React Router
- **Cache Headers**: HTML files have `no-cache`, assets have 1-year cache lifetime
- **Health Check**: `/health` endpoint returns JSON status (used by Docker and Railway)
- **Security**: Prevents directory traversal attacks
- **MIME Types**: Properly typed for HTML, JS, CSS, fonts, images, etc.

## Railway Deployment

### Prerequisites

- GitHub account with the cyberpunk-simulator repository
- Railway account (https://railway.app)

### Step 1: Connect Repository

1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select the `cyberpunk-simulator` repository
4. Railway automatically detects `railway.json` configuration

### Step 2: Configure Environment (Optional)

Add environment variables in Railway dashboard if needed in the future:

- Custom API endpoints
- Feature flags
- Analytics configuration

All environment variables are accessible via `process.env` in Node.js.

### Step 3: Deploy

Railway automatically triggers a deployment when you:

- Push to the main branch
- Create a new tag
- Manually trigger from dashboard

The build process:

1. Reads `railway.json` and `Dockerfile`
2. Builds the Docker image
3. Extracts the built image
4. Runs `node server.js` to start the server
5. Railway assigns a public URL

### Step 4: Monitor

View logs and status:

- Railway Dashboard: Real-time logs, CPU/memory usage
- Health checks: Railway monitors `/health` endpoint continuously
- Auto-restart: Enabled with 3 retries within 60-second window

## Environment Variables

### Current

None required for basic operation.

### Future

When adding environment variables, update:

1. `server.js` - Read from `process.env`
2. This documentation - Document all variables
3. `railway.json` - Add reference documentation

Example for future API configuration:

```json
{
  "API_BASE_URL": "https://api.example.com",
  "ANALYTICS_KEY": "your-key-here",
  "FEATURE_FLAG_X": "true"
}
```

## Performance & Size

### Image Size

- Final Docker image: ~200-300MB
  - Node 22 Alpine: ~180MB
  - React bundle: ~50-100MB
  - Server script: <1MB

### Build Time

- Local build: ~5-10 minutes (depends on machine and network)
- Railway build: ~10-15 minutes (cloud infrastructure)

### Cache Optimization

- Docker layer caching: Dependencies layer is cached, only code changes rebuild
- Static asset caching: 1-year cache lifetime for JavaScript/CSS bundles
- No-cache: HTML files re-validated every request

## Troubleshooting

### Docker build fails with "pnpm: not found"

The Dockerfile installs pnpm globally. If you see this error, ensure you're using Node 22+ and rebuild:

```bash
docker build --no-cache -t cyberpunk-simulator:latest .
```

### Container starts but returns 500 errors

Check that `dist/` was built properly:

```bash
docker run -it cyberpunk-simulator:latest ls -la apps/simulator/dist
```

If empty, the build step failed. Check the build logs.

### Port 3000 already in use

Use a different host port:

```bash
docker run -p 3001:3000 cyberpunk-simulator:latest
```

### Railway deployment fails

1. Check GitHub Actions workflow doesn't conflict
2. Verify `railway.json` is in the repository root
3. Check Railway logs for specific errors
4. Try re-deploying from Railway dashboard

## Development

### Local development without Docker

```bash
cd ../agnostic-simulator/apps/multi-game-simulator
VITE_BASE_URL=/cyberpunk/simulator/ vp dev
```

This runs the Vite dev server on http://localhost:5173/cyberpunk/simulator/.

### Building locally for testing

```bash
cd ../agnostic-simulator/apps/multi-game-simulator
VITE_BASE_URL=/cyberpunk/simulator/ vp build
VITE_BASE_URL=/cyberpunk/simulator/ vp preview
```

Then visit http://localhost:4173/cyberpunk/simulator.

## Next Steps

- Add environment variables as needed
- Configure custom domain in Railway
- Set up CI/CD monitoring
- Configure automated deployments on tags
