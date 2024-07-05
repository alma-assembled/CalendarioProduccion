// src/components/Event.js
import React from 'react';

const Event = ({ event }) => {
  return (
    <div>
      <h3>{event.titulo}</h3>
      <p>{event.descripcion}</p>
      <p>{event.fecha_inicio} - {event.fecha_fin}</p>
      <p>{event.equipos}</p>
    </div>
  );
};

export default Event;