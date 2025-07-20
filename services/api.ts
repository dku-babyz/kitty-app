import axios from 'axios';
import { getToken, saveToken } from '../utils/auth';

const API_URL = 'http://220.149.244.87:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRooms = async () => {
  try {
    const response = await api.get(`/rooms/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getMessages = async (roomId: number) => {
  try {
    const response = await api.get(`/messages/${roomId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    throw error;
  }
};

export interface UserCreate {
  username: string;
  phone_number: string;
  email?: string;
  password?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  phone_number: string;
  email?: string;
  is_active: boolean;
  experience_points: number;
  level: number;
  character_state: string;
  harmful_chat_count: number;
  messages: any[]; // You might want to define a more specific type for messages
}

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const createUser = async (userData: UserCreate) => {
  try {
    const response = await api.post(`/users/`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const login = async (username: string, password: string): Promise<{ token: TokenResponse; user: User }> => {
  try {
    const tokenResponse = await axios.post<TokenResponse>(
      `${API_URL}/token`,
      new URLSearchParams({
        username: username,
        password: password,
        grant_type: 'password',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    await saveToken(tokenResponse.data.access_token);
    const user = await fetchCurrentUser();
    return { token: tokenResponse.data, user };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export interface StoryGenerationResponse {
  final_story: string;
  final_image_path: string;
}

export const generateStory = async (riskScore: number) => {
  try {
    const response = await api.post<StoryGenerationResponse>(
      `/generate-story`,
      { risk_score: riskScore },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};