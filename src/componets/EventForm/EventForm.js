// src/App.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';

const EventForm = () => {
    const [eventos, setEventos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newEvento, setNewEvento] = useState({
        tipo: '',
        op: '',
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        equipos: ''
    });

    useEffect(() => {
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        const response = await axios.get('http://localhost:5000/eventos');
        setEventos(response.data);
    };

    const handleAddEvento = async () => {
        await axios.post('http://localhost:5000/eventos', newEvento);
        fetchEventos();
        setModalIsOpen(false);
    };

    return (
        <div className="App">
            <h1>Calendario de Eventos</h1>
            <Calendar />
            <button onClick={() => setModalIsOpen(true)}>Agregar Evento</button>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>Agregar Evento</h2>
                <form>
                    <label>
                        Tipo:
                        <input type="text" value={newEvento.tipo} onChange={(e) => setNewEvento({ ...newEvento, tipo: e.target.value })} />
                    </label>
                    <label>
                        OP:
                        <input type="number" value={newEvento.op} onChange={(e) => setNewEvento({ ...newEvento, op: e.target.value })} />
                    </label>
                    <label>
                        Título:
                        <input type="text" value={newEvento.titulo} onChange={(e) => setNewEvento({ ...newEvento, titulo: e.target.value })} />
                    </label>
                    <label>
                        Descripción:
                        <input type="text" value={newEvento.descripcion} onChange={(e) => setNewEvento({ ...newEvento, descripcion: e.target.value })} />
                    </label>
                    <label>
                        Fecha Inicio:
                        <input type="date" value={newEvento.fecha_inicio} onChange={(e) => setNewEvento({ ...newEvento, fecha_inicio: e.target.value })} />
                    </label>
                    <label>
                        Fecha Fin:
                        <input type="date" value={newEvento.fecha_fin} onChange={(e) => setNewEvento({ ...newEvento, fecha_fin: e.target.value })} />
                    </label>
                    <label>
                        Equipos:
                        <input type="text" value={newEvento.equipos} onChange={(e) => setNewEvento({ ...newEvento, equipos: e.target.value })} />
                    </label>
                    <button type="button" onClick={handleAddEvento}>Agregar</button>
                </form>
                <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default EventForm;
