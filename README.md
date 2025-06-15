# Expense Tracker

[![React](https://img.shields.io/badge/React-18.1.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-5.3.5-DB7093?logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive financial management application built with React and TypeScript that helps you track your income and expenses.

[//]: # (![Expense Tracker Screenshot]&#40;https://via.placeholder.com/800x450.png?text=Expense+Tracker+Screenshot&#41;)

## 🌟 Features

- **Monthly Financial Overview**: Track your finances on a month-by-month basis
- **Income and Expense Tracking**: Categorize and monitor all your financial transactions
- **Visual Summaries**: See your financial health at a glance with intuitive visualizations
- **Transaction Management**: Add, view, and categorize your financial transactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🐳 Docker Setup

This project includes Docker configuration for easy deployment.

### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker compose up -d
   ```

2. Access the application at [http://localhost](http://localhost)

3. Stop the container:
   ```bash
   docker compose down
   ```

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t expense-tracker .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 expense-tracker
   ```

3. Access the application at [http://localhost](http://localhost)

## 🧰 Available Scripts

- **`npm start`**: Runs the app in development mode
- **`npm test`**: Launches the test runner
- **`npm run build`**: Builds the app for production
- **`npm run eject`**: Ejects from Create React App configuration

## 📁 Project Structure

```
expense-tracker/
├── public/             # Static files
├── src/                # Source code
│   ├── components/     # React components
│   ├── data/           # Data files
│   ├── helpers/        # Helper functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── package.json        # Project dependencies and scripts
```

## 🔧 Technologies

- **React**: UI library for building the user interface
- **TypeScript**: For type-safe code
- **Styled Components**: For component-based styling
- **Docker**: For containerization and easy deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
