# Vite+ Monorepo Starter

A starter for creating a Vite+ monorepo.

## Development

- Check everything is ready:

```bash
vp run ready
```

- Run the tests:

```bash
vp run test -r
```

- Build the monorepo:

```bash
vp run build -r
```

- Run the development server:

```bash
vp run dev
```

## Deploy to GitHub Pages

The website app is configured for GitHub Pages at `/one-piece-simulator/`.

- Enable GitHub Pages in the repository settings and set the source to `GitHub Actions`.
- Push to `main` to trigger the workflow in `.github/workflows/deploy-github-pages.yml`.
