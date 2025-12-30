import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents } from '../utils/api';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Discover Amazing Events</h1>
        <p>Book tickets for concerts, conferences, and more!</p>
      </div>
      <div className="container">
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="no-events">No events available at the moment.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;