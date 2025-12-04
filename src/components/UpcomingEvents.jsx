import './UpcomingEvents.css';

const UpcomingEvents = ({ events = [], onCalendarClick, onEventClick }) => {
  if (events.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Upcoming</h2>
          <button className="view-all-link" onClick={onCalendarClick}>
            Calendar
          </button>
        </div>
        <div className="upcoming-list">
          <p className="empty-state">No upcoming events</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Upcoming</h2>
        <button className="view-all-link" onClick={onCalendarClick}>
          Calendar
        </button>
      </div>
      <div className="upcoming-list">
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={() => onEventClick && onEventClick(event.id)}
          />
        ))}
      </div>
    </section>
  );
};

const EventItem = ({ event, onClick }) => {
  const { name, date, time, isToday } = event;
  
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div
      className={`event-item ${isToday ? 'event-today' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="event-date">
        <div className="event-day">{day}</div>
        <div className="event-month">{month}</div>
      </div>
      <div className="event-details">
        <div className="event-name">{name}</div>
        <div className="event-time">{time}</div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
