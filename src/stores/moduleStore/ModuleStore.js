import { API_ENDPOINTS } from '@/config/apiConfig';
import { makeAutoObservable, runInAction } from 'mobx';

class ModuleStore {
  modules = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchModules = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_MODULES); // Adjust the API endpoint as necessary
      const data = await response.json();
      runInAction(() => {
        this.modules = data;
      });
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };
}

export default new ModuleStore();
