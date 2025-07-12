const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const medicineRoutes = require('./routes/medicineRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', medicineRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmastore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'PharmaStore API is running!' });
});
