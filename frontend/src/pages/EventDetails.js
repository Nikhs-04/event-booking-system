import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getEventById, createPayPalOrder, capturePayPalOrder } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './EventDetails.css';

const PAYPAL_CLIENT_ID = 'AXPxxCK082chrh_6QmU_VqIbAIRYUeo1eJTwZo3-8fDV8EKrKOXwt7Tz0SB_FjrcixMFc5Uuj6S6i6ec';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showPayPal, setShowPayPal] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEventById(id);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch event details');
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (numberOfTickets > event.availableSeats) {
      alert('Not enough seats available');
      return;
    }

    try {
      const response = await createPayPalOrder({
        eventId: id,
        numberOfTickets,
      });
      setOrderId(response.data.orderId);
      setShowPayPal(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create order');
    }
  };

  const createOrder = (data, actions) => {
    return orderId;
  };

  const onApprove = async (data, actions) => {
    try {
      await capturePayPalOrder({
        orderId: data.orderID,
        eventId: id,
        numberOfTickets,
      });
      alert('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      alert('Payment verification failed');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !event) {
    return <div className="error">{error || 'Event not found'}</div>;
  }

  const totalPrice = event.ticketPrice * numberOfTickets;

  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <div className="event-details">
        <div className="event-header">
          <img src={event.image} alt={event.title} />
          <div className="event-info">
            <h1>{event.title}</h1>
            <p className="event-category">{event.category}</p>
            <p className="event-date">📅 {formatDate(event.date)}</p>
            <p className="event-venue">📍 {event.venue}</p>
            <p className="event-seats">🎟️ {event.availableSeats} seats available</p>
            <p className="event-price">${event.ticketPrice} per ticket</p>
          </div>
        </div>

        <div className="event-description">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <div className="booking-section">
          <h2>Book Your Tickets</h2>
          <div className="ticket-selector">
            <label>Number of Tickets:</label>
            <input
              type="number"
              min="1"
              max={event.availableSeats}
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
            />
          </div>
          <div className="total-price">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>

          {!showPayPal ? (
            <button onClick={handleBookNow} className="btn-book">
              Book Now
            </button>
          ) : (
            <div className="paypal-container">
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  alert('Payment failed. Please try again.');
                }}
              />
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default EventDetails;