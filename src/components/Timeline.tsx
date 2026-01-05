import React from "react";
import "./Timeline.css";

const Timeline = ({ events }: { events: Event[] }) => {
  return (
    <div className="timeline-container">
      {events.map((event, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3>{event.title}</h3>
            <span className="timeline-date">{event.date}</span>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
