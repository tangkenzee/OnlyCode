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
This project includes a simple Express.js backend for data persistence and API functionality.

### Backend Setup
```bash
# Option 1: Use the start script
./start-server.sh

# Option 2: Manual setup
npm install
npm run server:dev
```

The backend provides:
- RESTful API for help requests, user management, and leaderboard
- Simple in-memory data storage
- CORS enabled for frontend integration
- Health check endpoint for monitoring

### API Endpoints
- `GET /api/health` - Server health status
- `GET /api/user/me` - Get current user profile
- `GET /api/help-requests` - List help requests (with filters)
- `POST /api/help-requests/:id/accept` - Accept help request
- `GET /api/leaderboard` - Get user rankings

### Troubleshooting

**API Connection Issues:**
1. Make sure the server is running on `http://localhost:3001`
2. Check the API Status component on the homepage
3. Check browser console for detailed error messages
4. Run `npm run server:dev` to start the backend

**Common Issues:**
- **Port conflicts**: Make sure port 3001 is available
- **Node.js version**: Requires Node.js v16 or higher
- **Dependencies**: Run `npm install` if you get module errors

### Development
The backend is a simple Express.js server in `server.js` that serves sample data. In production, you would replace this with a proper database and authentication system.

---

## License
MIT
