/*import React, { useState, useEffect } from 'react';
import { Scheduler} from '@aldabil/react-scheduler';
import { Button } from '@mui/material';
import axios from 'axios';
import { FaDropbox, FaBoxesStacked, FaPeopleCarryBox, FaRegChartBar } from "react-icons/fa6";
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
    console.log("useEffect:fuera")
    if (selectedEvent && selectedEvent.start && selectedEvent.end) {
      //const validStart = formatDateForDB(selectedEvent.start);
      //const validEnd = formatDateForDB(selectedEvent.end);

      console.log("hola:useEffect")
  
      //if (validStart && validEnd) {
        console.log("useEffect:dentro")
        setFormValues({
          title: selectedEvent.title || '',
          description: selectedEvent.description || '',
          start: selectedEvent.start,
          end: selectedEvent.end, 
          equipos: selectedEvent.equipos || '',
          tipo: selectedEvent.tipo || '',
          op: selectedEvent.op || ''
        });
      //} else {
      //  console.error('Invalid date value in useEffect:', selectedEvent.start, selectedEvent.end);
      //}
    }
  }, [selectedEvent]);
  

  const handleConfirm = async (event, action) => {
    console.log(action, ' :accion')
    if (!event || !event.start || !event.end) {
      console.error('Invalid event or date value:', event);
      return;
    }
    //const validStart = formatDateForDB(event.start);
    //const validEnd = formatDateForDB(event.end);

    //if (!validStart || !validEnd) {
    //  console.error('Invalid date value:', validStart, validEnd);
    //  return;
    //}
    // Convertir las propiedades relevantes a mayúsculas
    const upperCaseEvent = {
      titulo: String(event.title).toUpperCase(),
      tipo: String(event.tipo).toUpperCase(),
      op: event.op,
      descripcion: String(event.description).toUpperCase(),
      fecha_inicio: event.start.toISOString().substring(0, 19),
      fecha_fin: event.end.toISOString().substring(0, 19),
      equipos: String(event.equipos).toUpperCase() // Convertir a cadena si no lo es
    };
    if (action === "create") {
      try {
        const response = await axios.post('http://127.0.0.1:5000/eventos/', upperCaseEvent);
        fetchEvents();
        setSelectedEvent({ event, event_id: response.data.id });
        setShowForm(false); // Cerrar el formulario
      } catch (error) {
        console.error('Error adding event:', error);
      }
    } else if (action === "edit") {
      console.log('editar: ', event.event_id);
      try {
        await axios.put(`http://127.0.0.1:5000/eventos/${event.event_id}`, upperCaseEvent);
        fetchEvents();
        setSelectedEvent(null);
        setShowForm(false); // Cerrar el formulario
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };

  const handleEventClick = (event) => {
    console.log(':clik')
    if (event && event.title && event.start && event.end) {
      console.log('clik:dentro', event)
      //const validStart = formatDateForDB(event.start);
      //const validEnd = formatDateForDB(event.end);
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
      setShowForm(false); // Mostrar el formulario para editar el evento
    } else {
      console.error('El evento seleccionado no tiene título o fecha inicial/final válida.');
      //console.log("event:", event);
    }
  };

  const formatDateForDB = (date) => {
    console.log(':formatDate')
    if (date ){
      const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      console.error('Invalid date value:', date);
      return null;
    }
    console.log(':formatDate:dentro')
    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, '0');
    const day = String(validDate.getDate()).padStart(2, '0');
    const hours = String(validDate.getHours()).padStart(2, '0');
    const minutes = String(validDate.getMinutes()).padStart(2, '0');
    const seconds = String(validDate.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setFormValues({
      title: '',
      description: '',
      start: '',
      end: '',
      equipos: '',
      tipo: '',
      op: ''
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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
      fetchEvents(); // Refresca los eventos después de eliminar uno
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

        <div className="view-mode-buttons">
          <Button onClick={handleRedirect} >VER RESUMEN</Button>  
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
              { id: 4, text: "ENTREGA", value: "E" },
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
                {field.name === 'op' && < FaDropbox />}
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

export default EventCalendar;*/

import React, { useState } from 'react';
import { Scheduler ,EventActions, ProcessedEvent} from '@aldabil/react-scheduler';
import axios from 'axios';
import { es } from 'date-fns/locale';


const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/eventos/');
      setEvents(response.data.Data.map(event => ({
        event_id: event.id,
        title: event.titulo,
        start: new Date(event.fecha_inicio),
        end: new Date(event.fecha_fin),
        description: event.descripcion,
        equipos: event.equipos,
        tipo: event.tipo,
        op: event.op,
        color: getEventClass(event.tipo)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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

  const handleConfirm = async (
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent> => {
    console.log("handleConfirm =", action, event.title);
  
    return new Promise(async(res, rej) => {
      if (action === "edit") {
        // PUT event to remote DB
      } else if (action === "create") {
        // POST event to remote DB
      }
  
      const isFail = Math.random() > 0.6;
      setTimeout(() => {
        if (isFail) {
          rej("Ops... Failed");
        } else {
          res({
            ...event,
            event_id: event.event_id || Math.random()
          });
        }
      }, 3000);
    });
  };
  
  return (
    <Scheduler
      events={events}
      view="month"
      locale={es}
      onConfirm={handleConfirm}
      fields={[
        {
          name: 'op',
          type: 'input',
          config: { label: 'OP', multiline: false, rows: 1 }
        },
        {
          name: 'tipo',
          type: 'select',
          options: [
            { id: 1, text: 'MAQUILA', value: 'M' },
            { id: 2, text: 'FLEXO', value: 'F' },
            { id: 3, text: 'SUAJADORA', value: 'S' },
            { id: 4, text: 'ENTREGA', value: 'E' }
          ],
          config: { label: 'Tipo', multiline: true, errMsg: 'Introduce un tipo' }
        },
        {
          name: 'description',
          type: 'input',
          config: { label: 'Descripción', multiline: true, rows: 4 }
        },
        {
          name: 'equipos',
          type: 'input',
          config: { label: 'Equipos', multiline: true, rows: 4 }
        }
      ]}
      translations={{
        navigation: {
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          today: 'Hoy',
          agenda: 'Agenda'
        },
        form: {
          addTitle: 'Agregar Evento',
          editTitle: 'Editar Evento',
          confirm: 'Confirmar',
          delete: 'Eliminar',
          cancel: 'Cancelar'
        },
        event: {
          title: 'Título',
          start: 'Inicio',
          end: 'Fin',
          allDay: 'Todo el día'
        },
        validation: {
          required: 'Requerido',
          invalidEmail: 'Email inválido',
          onlyNumbers: 'Solo Números',
          min: 'Mínimo {{min}} letras',
          max: 'Máximo {{max}} letras'
        },
        moreEvents: 'Más...',
        noDataToDisplay: 'Sin datos',
        loading: 'Cargando...'
      }}
    />
  );
};


const handleConfirm = async (
  event: ProcessedEvent,
  action: EventActions
): Promise<ProcessedEvent> => {
  console.log("handleConfirm =", action, event.title);

  return new Promise(async(res, rej) => {
    if (action === "edit") {
      // PUT event to remote DB
    } else if (action === "create") {
      // POST event to remote DB
    }

    const isFail = Math.random() > 0.6;
    setTimeout(() => {
      if (isFail) {
        rej("Ops... Failed");
      } else {
        res({
          ...event,
          event_id: event.event_id || Math.random()
        });
      }
    }, 3000);
  });
};

const handleConfirm = async (event, action) => {
  console.log(action, ' :accion')
  if (!event || !event.start || !event.end) {
    console.error('Invalid event or date value:', event);
    return;
  }
  //const validStart = formatDateForDB(event.start);
  //const validEnd = formatDateForDB(event.end);

  //if (!validStart || !validEnd) {
  //  console.error('Invalid date value:', validStart, validEnd);
  //  return;
  //}
  // Convertir las propiedades relevantes a mayúsculas
