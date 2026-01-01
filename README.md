# FlowLint Web Linter

![Coverage](https://img.shields.io/badge/coverage-75.17%25-yellow)

Browser-based linting interface for n8n workflows.

## Features

- **Drag & Drop**: Analyze workflow files instantly.
- **Visual Feedback**: See errors highlighted directly on the workflow graph.
- **Rule Configuration**: Enable/disable rules on the fly.
- **Share Results**: Share analysis reports via unique URLs.

## Development

```bash
npm install
npm run dev
```

## Testing

Run unit tests with coverage:

```bash
npm run test:coverage
```

Run E2E tests (Playwright):

```bash
npm run test:e2e
```