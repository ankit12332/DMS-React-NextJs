// RoleStore.js
import { API_ENDPOINTS } from '@/config/apiConfig';
import { makeAutoObservable, runInAction } from 'mobx';

class RoleStore {
  roles = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchRoles = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_ROLES);
      const data = await response.json();
      runInAction(() => {
        this.roles = data;
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
}

export default new RoleStore();
