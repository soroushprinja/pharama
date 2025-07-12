# PharmaStore - Medicine Inventory Management System

A simple and efficient medicine inventory management system for pharmacies.

## Features

- Add, edit, and delete medicines
- Track stock levels with low stock alerts
- Monitor expiry dates with expiring soon alerts
- Search and filter medicines
- Export inventory data to CSV
- Mobile-responsive design
- INR currency support for Indian pharmacies

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB connection string
4. Start the server: `npm run dev`
5. Open `client/index.html` in your browser

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Currency: Indian Rupees (₹)

## Usage

1. Start the backend server
2. Open the frontend in your browser
3. Add medicines using the form
4. View and manage your inventory in the table
5. Use search and filters to find specific medicines
6. Export data when needed

## API Endpoints

- GET /api/medicines - Get all medicines
- POST /api/medicines - Add new medicine
- PUT /api/medicines/:id - Update medicine
- DELETE /api/medicines/:id - Delete medicine
