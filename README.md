# Buddy Code Mentor

## Project Overview
A modern React + TypeScript app with custom UI components, Tailwind CSS, and Vite. This project helps users request and solve coding problems collaboratively.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## Testing

### Run Unit Tests
```bash
npm test
```

### Testing Tools
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Code Quality

- **Lint:**
  ```bash
  npm run lint
  ```
- **Format:**
  ```bash
  npm run format
  ```
- **Pre-commit hooks:** (Recommended)
  - Use [Husky](https://typicode.github.io/husky/) to enforce linting/formatting before commits.

---

## Accessibility & Responsiveness Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Sufficient color contrast
- [ ] Responsive layouts for mobile and desktop
- [ ] ARIA attributes where appropriate
- [ ] Semantic HTML

---

## Contributing
1. Fork the repo & create a feature branch
2. Make your changes (with tests!)
3. Run lint and tests before pushing
4. Open a pull request

---

## CI/CD
- Automated linting and testing on pull requests via GitHub Actions (see `.github/workflows/ci.yml`)

---

## License
MIT
