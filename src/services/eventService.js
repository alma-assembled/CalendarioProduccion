 // src/services/eventService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const addEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/eventos`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    await axios.put(`${API_URL}/eventos/${id}`, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const bajaEvent = async (id) => {
  try {
    await axios.put(`${API_URL}/eventos/${id}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
