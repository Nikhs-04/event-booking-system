import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="event-card">
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-date">📅 {formatDate(event.date)}</p>
        <p className="event-venue">📍 {event.venue}</p>
        <p className="event-category">{event.category}</p>
        <div className="event-footer">
          <span className="event-price">${event.ticketPrice}</span>
          <span className="event-seats">{event.availableSeats} seats left</span>
        </div>
        <Link to={`/event/${event._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;