# Backend Database Configuration

Currently, this project uses **SQLite** for development ease (no installation required).
However, it is designed to be easily switched to **MySQL** for production.

## Switching to MySQL

To switch from SQLite to MySQL, follow these steps:

1.  **Install MySQL**: Ensure you have a running MySQL server.
2.  **Create Database**: Create a new empty database in MySQL (e.g., `routeapp`).
3.  **Update `.env`**:
    In `server/.env`, change the `DATABASE_URL` to your MySQL connection string:
    ```env
    # Old (SQLite)
    # DATABASE_URL="file:./dev.db"

    # New (MySQL)
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    # Example:
    # DATABASE_URL="mysql://root:admin@localhost:3306/routeapp"
    ```
4.  **Update `schema.prisma`**:
    In `server/prisma/schema.prisma`, change the provider from `sqlite` to `mysql`:
    ```prisma
    datasource db {
      provider = "mysql" // Change this from "sqlite"
      url      = env("DATABASE_URL")
    }
    ```
5.  **Run Migrations**:
    Apply the schema to your new MySQL database:
    ```bash
    npx prisma migrate deploy
    ```

Your application is now running on MySQL!
