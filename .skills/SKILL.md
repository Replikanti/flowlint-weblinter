# FlowLint WebLinter Development Skill

## Metadata
- **Name:** flowlint-weblinter-dev
- **License:** MIT
- **Compatibility:** Claude Code, Node.js 24+
- **Deployment:** GitHub Pages

## Description

Browser-based linting interface. Allows users to paste n8n workflows and get instant linting results without installation. Integrates with Share API for result sharing.

## Capabilities

- **editor-feature:** Monaco editor enhancements
- **ui-improvement:** UI/UX improvements
- **share-integration:** Share API integration
- **performance:** Optimize linting performance
- **fix-bug:** Fix UI or linting bugs

## Project Structure

```
flowlint-weblinter/
├── src/
│   ├── components/      # UI components
│   ├── editor/          # Monaco editor setup
│   └── lib/             # Utilities
└── public/              # Static assets
```

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |

## Tech Stack

- React + Vite
- Monaco Editor
- @replikanti/flowlint-core (browser build)
- Tailwind CSS

## Related Files

- `CLAUDE.md` - Main project instructions
- `README.md` - Documentation
