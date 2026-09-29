# Appointment Booking System
A doctor appointment booking system that allows patients to view their bookings record, view doctor availability and book consultations, while receptionists can view doctors' schedules and manage doctor leave periods.

# Feature
## Patient
- Login as a patient
- View booking records
- View doctor available consultation slots and make appointment

## Receptionist
- Login as a receptionist
- View all doctor appointments and leaves
- Create leave for doctor

# Tech Stack
## Frontend
- Vue 3
- Vuetify

## Backend
- Node.js
- Express
- MySQL
- Sequelize ORM

# Prerequisites and version
- Node.js: ^22.18.0
- MySQL: 8.0.46

# Installation
Clone the repository from Github
```
git clone https://github.com/SeowKarYan/booking-system.git
```

## Frontend
### Install frontend dependencies
Run *cd frontend* command to change the directory into frontend directory.

Run *npm install* command to install the dependencies, it will generate `node_modules` folder under frontend directory
```
cd frontend
npm install
```
### Build frontend
Inside frontend directory, run *npm run build* command to build the project, it will generate `dist` folder
```
npm run build
``` 

## Backend
If you are still in frontend directory run *cd ../* to change the directory into booking-system project directory

```
cd ../
```

### Install backend dependencies
Run *cd backend* command to change the directory into backend directory.

Run *npm install* command to install the dependencies, it will generate `node_modules` folder under backend directory
```
cd backend
npm install
```

### Create `.env` file
Create `.env` in the backend directory, put in your mySQL password in DB_PASSWORD
```
# DATABASE
DB_NAME=booking_system
DB_USERNAME=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=07092ecbd13cba32044d44639e9ea08dc3ca71a0e1a4337d5136f79a905741e6

# ENVIRONMENT
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Running the Application
Inside the backend directory, run *npm run start* command to start the application, open `http://localhost:5000` in browser

```
npm run start
```