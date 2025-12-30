import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../utils/api';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-bookings">
      <div className="container">
        <h1>My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.event?.title || 'Event Deleted'}</h3>
                  <span className={`status ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="booking-details">
                  <p>📅 Event Date: {formatDate(booking.event?.date)}</p>
                  <p>📍 Venue: {booking.event?.venue}</p>
                  <p>🎟️ Tickets: {booking.numberOfTickets}</p>
                  <p>💰 Total Amount: ${booking.totalAmount}</p>
                  <p>📆 Booked On: {formatDate(booking.bookingDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;