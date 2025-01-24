import axios from 'axios';
import { HOST } from '@/utils/constants';

export const apiClient = axios.create({
  baseURL: HOST,
  timeout: 10000,
  withCredentials: true,
});
