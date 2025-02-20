import { create } from 'zustand';

export const authStore = create(() => ({
  authUser: null,
  isCheckingAuth: true,
}));
