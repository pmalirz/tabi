# Tabi - The Wall for Teams - Firefox Addon

## How to build

Build sources

```bash
npm run-script build:dev / build:prod
```

Package xpi plugin

```bash
web-ext sign --api-key=${API_KEY} --api-secret=${API_SECRET} --source-dir ./dist
```