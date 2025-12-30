import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent, getAllBookings } from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEvents(),
        getAllBookings(),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((event) => event._id !== id));
        alert('Event deleted successfully');
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.paymentStatus === 'completed' ? booking.totalAmount : 0),
    0
  );

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p className="stat-number">{events.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{bookings.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Manage Events
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            View Bookings
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h2>Events</h2>
              <Link to="/admin/create-event" className="btn-create">
                + Create New Event
              </Link>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Price</th>
                    <th>Available Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.venue}</td>
                      <td>${event.ticketPrice}</td>
                      <td>{event.availableSeats}</td>
                      <td className="actions">
                        <Link to={`/admin/edit-event/${event._id}`} className="btn-edit">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>All Bookings</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Event</th>
                    <th>Tickets</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.user?.name}</td>
                      <td>{booking.event?.title}</td>
                      <td>{booking.numberOfTickets}</td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        <span className={`status ${booking.paymentStatus}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(booking.bookingDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;