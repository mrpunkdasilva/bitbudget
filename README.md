# BitBudget - Financial Management System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SASS](https://img.shields.io/badge/SASS-1.69.5-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.35.1-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive financial management application with Web3 integration and AI-powered financial advice.

```
██████╗ ██╗████████╗██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗
██╔══██╗██║╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝╚══██╔══╝
██████╔╝██║   ██║   ██████╔╝██║   ██║██║  ██║██║  ███╗█████╗     ██║   
██╔══██╗██║   ██║   ██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║   
██████╔╝██║   ██║   ██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   
╚═════╝ ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
```

## 🌟 Features

- **User Authentication**: Secure login and registration with JWT
- **Financial Management**: Track income and expenses with detailed categorization
- **Visual Reports**: Charts and summaries of your financial health
- **Web3 Integration**: Connect your crypto wallet and track assets
- **AI Financial Advisor**: Get personalized financial recommendations
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Start the development environment:
   ```bash
   npm run docker:dev
   ```
   This will start the frontend in development mode with hot reloading.

3. Start only the backend:
   ```bash
   npm run docker:backend
   ```

4. Start everything in production mode:
   ```bash
   npm run docker:all
   ```

5. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Production build: [http://localhost](http://localhost)

### Local Development (Without Docker)

1. Install dependencies:
   ```bash
   npm run setup
   ```

   If you encounter dependency issues, use the clean install script:
   ```bash
   ./clean-install.sh
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. In a separate terminal, navigate to the server directory and start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Make sure you have PostgreSQL running locally or update the connection string in the server's environment variables.

## 🧰 Available Scripts

- **`npm run setup`**: Installs dependencies with legacy peer deps flag (resolves compatibility issues)
- **`npm run dev`**: Runs the app in development mode
- **`npm run build`**: Builds the app for production
- **`npm run preview`**: Previews the production build locally
- **`npm test`**: Runs tests once
- **`npm run test:watch`**: Runs tests in watch mode
- **`npm run lint`**: Checks code for linting errors
- **`npm run lint:fix`**: Automatically fixes linting errors when possible
- **`npm run format`**: Formats code using Prettier
- **`npm run format:check`**: Checks if code is formatted according to Prettier rules
- **`npm run docker:dev`**: Starts the frontend development environment in Docker
- **`npm run docker:prod`**: Starts the production frontend in Docker
- **`npm run docker:backend`**: Starts only the backend in Docker
- **`npm run docker:all`**: Starts all services in Docker

## 📁 Project Structure

```
expense-tracker/
├── public/              # Static assets
├── server/              # Backend code
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── ...
├── src/                 # Frontend code
│   ├── components/      # React components
│   │   ├── AiAdvisor/   # AI recommendation components
│   │   ├── Auth/        # Authentication components
│   │   ├── Web3/        # Web3 integration components
│   │   ├── InfoArea/    # Financial information area
│   │   ├── InputArea/   # Form for adding transactions
│   │   ├── TableArea/   # Transactions table
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   ├── styles/          # SASS styles
│   ├── types/           # TypeScript type definitions
│   └── ...
├── Dockerfile           # Production Docker configuration
├── Dockerfile.dev       # Development Docker configuration
├── docker-compose.yml   # Docker Compose configuration
└── ...
```

## 🔧 Technologies

- **Frontend**:
  - **React 18.2.0**: UI library for building the user interface
  - **TypeScript 5.2.2**: For type-safe code
  - **SASS/SCSS**: For advanced styling with variables and mixins
  - **Vite 4.5.0**: Fast build tool and development server
  - **React Router 6.20.0**: For application routing
  - **Chart.js & React-Chartjs-2**: For data visualization

- **Backend**:
  - **Node.js**: JavaScript runtime
  - **Express 4.18.2**: Web framework for Node.js
  - **Sequelize 6.35.1**: ORM for PostgreSQL
  - **PostgreSQL 14**: Relational database
  - **JWT**: For authentication
  - **bcryptjs**: For password hashing
  - **ethers.js**: For Web3 integration

- **DevOps**:
  - **Docker & Docker Compose**: For containerization and easy deployment
  - **Nginx**: High-performance web server for serving the application

- **Development Tools**:
  - **ESLint**: For code quality and style checking
  - **Prettier**: For code formatting
  - **Vitest**: For testing

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@bitbudget.com
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
