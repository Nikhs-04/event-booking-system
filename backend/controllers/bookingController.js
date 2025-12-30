const Booking = require('../models/Booking');
const Event = require('../models/Event');
const paypal = require('@paypal/checkout-server-sdk');
const paypalClient = require('../config/paypal');

// Create PayPal order
const createPayPalOrder = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const amount = (event.ticketPrice * numberOfTickets).toFixed(2);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount
        },
        description: `${numberOfTickets} ticket(s) for ${event.title}`
      }],
      application_context: {
        brand_name: 'Event Booking System',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/booking-success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/booking-cancel`
      }
    });

    const order = await paypalClient.client().execute(request);

    res.json({
      orderId: order.result.id,
      amount: amount
    });
  } catch (error) {
    console.error('PayPal Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Capture PayPal payment and create booking
const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId, eventId, numberOfTickets } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.client().execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalAmount = event.ticketPrice * numberOfTickets;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      numberOfTickets,
      totalAmount,
      paymentStatus: 'completed',
      paymentIntentId: capture.result.id
    });

    // Update available seats
    event.availableSeats -= numberOfTickets;
    await event.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Capture Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('event')
      .populate('user', 'name email')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
  getUserBookings,
  getAllBookings
};