import ModuleStore from './moduleStore/ModuleStore';

class RootStore {
  constructor() {
    this.moduleStore = ModuleStore;
  }
}

export default new RootStore();
