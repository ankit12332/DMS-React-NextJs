// ProgramStore.js
import { API_ENDPOINTS } from '@/config/apiConfig';
import { makeAutoObservable, runInAction } from 'mobx';

class ProgramStore {
  programs = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchPrograms = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_PROGRAMS);
      const data = await response.json();
      runInAction(() => {
        this.programs = data;
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };
}

export default new ProgramStore();
