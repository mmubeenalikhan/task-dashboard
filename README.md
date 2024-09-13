# Task Management Service

This application provides a Task Management Dashboard with functionality to create, update, delete, and fetch tasks. It uses Express.js for the server, Sequelize for ORM, and Redis for caching.

## Getting Started

To run the application, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (for the database)
- [Redis](https://redis.io/) (for caching)

### Installation

1. **Clone the repository:**

```sh
  git clone https://github.com/mmubeenalikhan/task-management-api.git
  cd task-management-api
```

2. **Install dependencies:**

```sh
    npm install
```

3. **Create and configure the .env file:**

Copy the sample environment file to .env:

```sh
    cp .env.sample .env
```

Update .env with your PostgreSQL connection and redis connection details with the port as well.

4. **Commands to run the project**

```sh
     npm run db:set
     npm start
```
