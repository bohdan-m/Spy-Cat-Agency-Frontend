import axios from 'axios';
import { SpyCat } from '../types';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const catAPI = {
  getAll: () => api.get<SpyCat[]>('/cats/'),
  getOne: (id: number) => api.get<SpyCat>(`/cats/${id}/`),
  create: (data: Omit<SpyCat, 'id'>) => api.post<SpyCat>('/cats/', data),
  update: (id: number, data: { salary: string }) => api.patch<SpyCat>(`/cats/${id}/`, data),
  delete: (id: number) => api.delete<void>(`/cats/${id}/`),
};