# Grand Archive Comprehensive Rules mirror

This directory mirrors the official [Grand Archive Comprehensive Rules](https://rules.gatcg.com/) as individual Markdown pages. The hierarchy follows the official page URLs so every page has a stable, descriptive path.

Refresh the mirror from the repository root with:

```sh
node submodules/grand-archive/.agents/skills/grand-archive-rules/scripts/sync-comprehensive-rules.mjs
```

The importer reads the official GitBook page index at `https://rules.gatcg.com/~gitbook/site-index`, fetches each corresponding `.md` page, and intentionally leaves existing files outside its URL-shaped hierarchy untouched.
