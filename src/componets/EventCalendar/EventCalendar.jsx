import React, { useState, useEffect } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import { Button } from '@mui/material';
import axios from 'axios';
import { FaDropbox, FaBoxesStacked, FaPeopleCarryBox, FaRegChartBar } from 'react-icons/fa6';
import '../EventCalendar/EventCalendar.css';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom'; 

const EventCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    equipos: '',
    tipo: '',
    op: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/eventos/');
      setEvents(response.data.Data.map(event => ({
        event_id: event.id,
        tipo: event.tipo,
        op: event.op,
        title: event.titulo,
        start: new Date(event.fecha_inicio),
        end: new Date(event.fecha_fin),
        description: event.descripcion,
        equipos: event.equipos,
        color: getEventClass(event.tipo)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (selectedEvent && selectedEvent.start && selectedEvent.end) {
      setFormValues({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        start: selectedEvent.start,
        end: selectedEvent.end,
        equipos: selectedEvent.equipos || '',
        tipo: selectedEvent.tipo || '',
        op: selectedEvent.op || ''
      });
    }
  }, [selectedEvent]);

  const handleConfirm = async (event, action) => {
    //console.log("handleConfirm =", action, event.title);

    const upperCaseEvent = {
      titulo: String(event.title).toUpperCase(),
      tipo: String(event.tipo).toUpperCase(),
      op: event.op,
      descripcion: String(event.description).toUpperCase(),
      fecha_inicio: event.start.toISOString().substring(0, 19),
      fecha_fin: event.end.toISOString().substring(0, 19),
      equipos: String(event.equipos).toUpperCase()
    };

    try {
      if (action === "edit") {
        await axios.put(`http://127.0.0.1:5000/eventos/${event.event_id}`, upperCaseEvent);
      } else if (action === "create") {
        await axios.post('http://127.0.0.1:5000/eventos/', upperCaseEvent);
      }
      fetchEvents();
      setShowForm(false);
      return {
        ...event,
        event_id: event.event_id || Math.random()
      };
    } catch (error) {
      console.error('Error processing event:', error);
      throw new Error('Ops... Failed');
    }
  };

  const handleEventClick = (event) => {
    if (event && event.title && event.start && event.end) {
      setSelectedEvent(event);
      setFormValues({
        title: event.title || '',
        description: event.description || '',
        start: event.start.toISOString().substring(0, 19),
        end: event.end.toISOString().substring(0, 19),
        equipos: event.equipos || '',
        tipo: event.tipo || '',
        op: event.op || ''
      });
      setShowForm(false);
    } else {
      console.error('El evento seleccionado no tiene título o fecha inicial/final válida.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventClass = (tipo) => {
    switch (tipo) {
      case 'M':
        return '#6e4bc0';
      case 'F':
        return '#61acc5';
      case 'S':
        return '#d66e32';
      case 'E':
        return '#418138';
      default:
        return '#d3d3d3';
    }
  };

  const handleBajaEvent = async (eventId) => {
    try {
      await axios.put(`http://127.0.0.1:5000/eventos/baja-evento/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleRedirect = () => {
    navigate('/resumen');
  };

  return (
    <div className="container">
      <h1 className="calendar-title">PRODUCCIÓN ASSEMBLED</h1>
      <div className='colors-menu'>
        <div>
          <div className='event-maquila'>.</div><h6>MAQUILA</h6>
        </div>
        <div>
          <div className="event-flexo">.</div><h6>FLEXO</h6>
        </div>
        <div>
          <div className='event-suajadora'>.</div><h6>SUAJADORA</h6>
        </div>
        <div>
          <div className='event-entrega'>.</div><h6>ENTREGA</h6>
        </div>
      </div>
      <div className="view-mode-buttons">
        <Button onClick={handleRedirect}>VER RESUMEN</Button>
      </div>
      <Scheduler
        events={events}
        view='month'
        onConfirm={handleConfirm}
        onEventClick={handleEventClick}
        locale={es}
        fields={[
          {
            name: "op",
            type: "input",
            config: { label: "OP", multiline: false, rows: 1 }
          },
          {
            name: "tipo",
            type: "select",
            options: [
              { id: 1, text: "MAQUILA", value: "M" },
              { id: 2, text: "FLEXO", value: "F" },
              { id: 3, text: "SUAJADORA", value: "S" },
              { id: 4, text: "ENTREGA", value: "E" }
            ],
            config: { label: "Tipo", multiline: true, errMsg: "Introduce un tipo" }
          },
          {
            name: "description",
            type: "input",
            config: { label: "Descripción", multiline: true, rows: 4 }
          },
          {
            name: "equipos",
            type: "input",
            config: { label: "Equipos", multiline: true, rows: 4 }
          }
        ]}
        viewerExtraComponent={(fields, event) => (
          <div>
            {fields.map((field, i) => (
              <div key={i} className='componentesDetalles'>
                {field.name === 'op' && <FaDropbox />}
                {field.name === 'tipo' && <FaBoxesStacked />}
                {field.name === 'description' && <FaRegChartBar />}
                {field.name === 'equipos' && <FaPeopleCarryBox />}
                <p>{field.name}: {event[field.name]}</p>
              </div>
            ))}
          </div>
        )}
        translations={{
          navigation: {
            month: "Mes",
            week: "Semana",
            day: "Día",
            today: "Hoy",
            agenda: "Agenda"
          },
          form: {
            addTitle: "Agregar Evento",
            editTitle: "Editar Evento",
            confirm: "Confirmar",
            delete: "Eliminar",
            cancel: "Cancelar"
          },
          event: {
            title: "Título",
            start: "Inicio",
            end: "Fin",
            allDay: "Todo el día"
          },
          validation: {
            required: "Requerido",
            invalidEmail: "Email inválido",
            onlyNumbers: "Solo Números",
            min: "Mínimo {{min}} letras",
            max: "Máximo {{max}} letras"
          },
          moreEvents: "Más...",
          noDataToDisplay: "Sin datos",
          loading: "Cargando..."
        }}
        onDelete={handleBajaEvent}
      >
      </Scheduler>
    </div>
  );
};

export default EventCalendar;
