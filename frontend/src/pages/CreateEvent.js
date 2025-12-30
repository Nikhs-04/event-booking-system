import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventById } from '../utils/api';
import './CreateEvent.css';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'concert',
    ticketPrice: '',
    totalSeats: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEventById(id);
      const event = response.data;
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0],
        venue: event.venue,
        category: event.category,
        ticketPrice: event.ticketPrice,
        totalSeats: event.totalSeats,
        image: event.image,
      });
    } catch (error) {
      setError('Failed to fetch event');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await updateEvent(id, formData);
        alert('Event updated successfully');
      } else {
        await createEvent(formData);
        alert('Event created successfully');
      }
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <div className="container">
        <h1>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Enter event description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="concert">Concert</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Venue *</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="Enter venue location"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ticket Price ($) *</label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter total seats"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;