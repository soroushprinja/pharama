const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

// GET all medicines
router.get('/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ dateAdded: -1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single medicine
router.get('/medicines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new medicine
router.post('/medicines', async (req, res) => {
    const medicine = new Medicine({
        name: req.body.name,
        batchNo: req.body.batchNo,
        company: req.body.company,
        quantity: req.body.quantity,
        price: req.body.price,
        expiryDate: req.body.expiryDate,
        category: req.body.category
    });

    try {
        const newMedicine = await medicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update medicine
router.put('/medicines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        medicine.name = req.body.name || medicine.name;
        medicine.batchNo = req.body.batchNo || medicine.batchNo;
        medicine.company = req.body.company || medicine.company;
        medicine.quantity = req.body.quantity !== undefined ? req.body.quantity : medicine.quantity;
        medicine.price = req.body.price !== undefined ? req.body.price : medicine.price;
        medicine.expiryDate = req.body.expiryDate || medicine.expiryDate;
        medicine.category = req.body.category || medicine.category;

        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE medicine
router.delete('/medicines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
