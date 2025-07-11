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

## Backend Integration
This project integrates with a backend API for data persistence and real-time features.

### Backend Setup
```bash
# Option 1: Use the start script
./start-backend.sh

# Option 2: Manual setup
cd backend
npm install
npm run dev
```

The backend provides:
- RESTful API for help requests, user management, and problems
- WebSocket support for real-time chat during help sessions
- User authentication and profile management
- Leaderboard and statistics tracking

### Troubleshooting

**API Connection Issues:**
1. Make sure the backend is running on `http://localhost:3001`
2. Check the API Status component on the homepage
3. If backend is not available, the app will use mock data
4. Check browser console for detailed error messages

**Common Issues:**
- **CORS errors**: Backend has CORS enabled, should work automatically
- **Port conflicts**: Make sure ports 3001 and 3002 are available
- **Node.js version**: Requires Node.js v16 or higher

### API Documentation
See `backend/README.md` for complete API documentation and setup instructions.

---

## License
MIT
