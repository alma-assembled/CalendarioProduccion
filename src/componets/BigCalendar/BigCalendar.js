/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BigCalendar.css'; // Estilo CSS para la tabla

const EventTable = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Simulando la carga de eventos desde una API
      const response = await axios.get('http://127.0.0.1:5000/eventos');
      setEvents(response.data.Data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Función para obtener las últimas dos semanas a partir de la fecha actual
  const getLastTwoWeeksFromDate = () => {
    const days = [];
    const today = new Date();
    let cont =  0;
    let cont2 = 0;
    while (today.getDay()+cont  >  0 ) {
      cont--;
      const date = new Date(today);
      date.setDate(today.getDate() + cont);
      days.push(date);
      cont2++;
    }
    for (let i = 0; i < 14-cont2; i++) { // Cambiado a 14 para obtener las últimas dos semanas
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    

    return days //days.reverse(); // Devuelve los días en orden ascendente (más antiguo al más reciente)
  };

  // Función para dividir los días en filas y columnas por día de la semana
  const splitDaysIntoRows = (days) => {
    const rows = [[], [], [], [], [], [], []]; // 7 días de la semana
    days.forEach((day, index) => {
      const column = day.getDay(); // Obtener el día de la semana (0-6, donde 0 es Domingo)
      rows[column].push(day);
    });
    console.log(rows)
    return rows;
  };
  

  // Función para renderizar el encabezado de la tabla con los nombres de los días de la semana
  const renderTableHeader = () => {
    const header = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return header.map((day, index) => <th key={index}>{day}</th>);
  };

  // Función para renderizar los eventos para un día específico
  const renderEventsForDay = (day) => {
    const eventsForDay = events.filter(event => {
      const eventDate = new Date(event.fecha_inicio); // Suponiendo que tienes un campo 'fecha_inicio' en tu evento
      return eventDate.toDateString() === day.toDateString();
    });

    return (
      <ul className='contenido'>
        {eventsForDay.map(event => (
          <li className={event.tipo} key={event.id}>
            <strong>{event.titulo}</strong> - {event.descripcion}
          </li>
        ))}
      </ul>
    );
  };

  // Función para renderizar los datos de la tabla
  const renderTableData = () => {
    const days = getLastTwoWeeksFromDate();
    const rows = splitDaysIntoRows(days);

    return days.map((day, index) => (
      <tr key={index}>
        {rows.map((column, colIndex) => (
          <td key={colIndex}>
            {column[index] ? (
              <React.Fragment>
                <div>{column[index].toLocaleDateString('es-ES', {  month: 'long', day: 'numeric' })}</div>
                <div>{renderEventsForDay(column[index])}</div>  
              </React.Fragment>
            ) : null}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="event-table-container">
      <h2>Produccion Assembled </h2>
      <div className='colors-menu'>
          <div>
            <div className='event-maquila '>
              .
            </div><h6>MAQUILA</h6>
          </div>
          <div>
            <div className="event-flexo">
              .
            </div><h6>FLEXO</h6>
          </div>
          <div>
            <div className='event-suajadora'>
              .
            </div><h6>SUAJADORA</h6>
          </div>
          <div>
            <div className='event-entrega'>
              .
            </div><h6>ENTREGA</h6>
          </div>
        </div>

      <table className="event-table">
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BigCalendar.css'; // Estilo CSS para la tabla

const EventTable = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Simulando la carga de eventos desde una API
      const response = await axios.get('http://127.0.0.1:5000/eventos');
      setEvents(response.data.Data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Función para obtener las últimas dos semanas a partir de la fecha actual
  const getLastTwoWeeksFromDate = () => {
    const days = [];
    const today = new Date();
    let cont_disninuir = today.getDay();
    let cont2 = 0;
    while ((today.getDay() - cont2) > 0) {
      const date = new Date(today);
      date.setDate(today.getDate() - cont_disninuir);
      days.push(date);
      cont2++;
      cont_disninuir--;
    }
    for (let i = 0; i < 14 - cont2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Función para dividir los días en dos filas y siete columnas
  const splitDaysIntoRows = (days) => {
    const rows = [[], []]; // Dos filas
    days.forEach((day, index) => {
      const row = Math.floor(index / 7); // Dividir en dos filas
      //console.log(index);
      //console.log(row);
      //console.log(day)
      rows[row].push(day);
    });
    return rows;
  };

  // Función para renderizar el encabezado de la tabla con los nombres de los días de la semana
  const renderTableHeader = () => {
    const header = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return header.map((day, index) => <th key={index}>{day}</th>);
  };

  // Función para renderizar los eventos para un día específico
  const renderEventsForDay = (day) => {
    const eventsForDay = events.filter(event => {
      const eventDate = new Date(event.fecha_inicio);
      return eventDate.toDateString() === day.toDateString();
    });

    return (
      <ul className='contenido'>
        {eventsForDay.map(event => (
          <li className={event.tipo} key={event.id}>
            <strong>{event.titulo}</strong> - {event.descripcion}
          </li>
        ))}
      </ul>
    );
  };

  // Función para renderizar los datos de la tabla
  const renderTableData = () => {
    const days = getLastTwoWeeksFromDate();
    const rows = splitDaysIntoRows(days);

    return rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((day, colIndex) => (
          <td key={colIndex}>
            {day ? (
              <React.Fragment>
                <div>{day.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}</div>
                <div>{renderEventsForDay(day)}</div>
              </React.Fragment>
            ) : null}
          </td>
        ))}
      </tr>
    ));
  };
  return (
    <div className="event-table-container">
      <h2>Producción Assembled</h2>
      <div className='colors-menu'>
          <div>
            <div className='event-maquila '>
              .
            </div><h6>MAQUILA</h6>
          </div>
          <div>
            <div className="event-flexo">
              .
            </div><h6>FLEXO</h6>
          </div>
          <div>
            <div className='event-suajadora'>
              .
            </div><h6>SUAJADORA</h6>
          </div>
          <div>
            <div className='event-entrega'>
              .
            </div><h6>ENTREGA</h6>
          </div>
        </div>

      <table className="event-table">
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
