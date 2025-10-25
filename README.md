# CPU Management App

A simple full-stack web app for managing CPUs and their sockets. 

---
## Tech Stack
- **Frontend:** React + TypeScript + MUI  
- **Backend:** Node.js + Express + Prisma  
- **Database:** PostgreSQL
---

## Run Instructions

### Backend

cd cpu-app-server
npm install

#### Create a .env file:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cpu_db?schema=public"

#### Run migrations and seed sockets:

npx prisma migrate dev Cpu init
npx prisma db seed

#### Start the backend:

npm start

Runs on http://localhost:5000

### Frontend
cd ../cpu-app-ui
npm install
npm start

Runs on http://localhost:3000


