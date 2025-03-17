import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  error: null,

  checkAuth: async () => {
    try {
      const response = await api.get('api/users/me');
      set({ authUser: response.data });
      return { success: true };
    } catch (error) {
      return { success: false };
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await api.post('api/auth/signup', { ...data });
      set({ authUser: response.data });
      return { success: true };
    } catch (error) {
      set({ error: error.response.data.message });
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await api.post('api/auth/login', { ...data });
      set({ authUser: response.data });
      return { success: true };
    } catch (error) {
      set({ error: error.response.data.message });
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await api.post('api/auth/logout');
      set({ authUser: null });
      return { success: true };
    } catch (error) {
      set({ error: error.response.data.message });
      return { success: false };
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (image, displayName) => {
    try {
      set({ isUpdatingProfile: true });

      const formData = new FormData();
      if (image) formData.append('image', image);
      if (displayName) formData.append('displayName', String(displayName));

      const response = await api.patch('api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ authUser: response.data });
      return { success: true };
    } catch (error) {
      set({ error: error.response.data.message });
      return { success: false };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  setError: (error) => {
    set({ error });
  },
}));
