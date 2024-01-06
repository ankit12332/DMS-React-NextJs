import ModuleStore from './moduleStore/ModuleStore';
import ProgramStore from './programStore/ProgramStore';
import RoleStore from './roleStore/RoleStore';

class RootStore {
  constructor() {
    this.moduleStore = ModuleStore;
    this.programStore = ProgramStore;
    this.roleStore = RoleStore;
  }
}

export default new RootStore();
