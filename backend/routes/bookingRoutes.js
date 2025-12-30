const express = require('express');
const {
  createPayPalOrder,
  capturePayPalOrder,
  getUserBookings,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.post('/create-paypal-order', protect, createPayPalOrder);
router.post('/capture-paypal-order', protect, capturePayPalOrder);
router.get('/my-bookings', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings);

module.exports = router;