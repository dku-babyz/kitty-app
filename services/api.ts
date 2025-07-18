import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000';

export const getRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getMessages = async (roomId: number) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${roomId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    throw error;
  }
};
