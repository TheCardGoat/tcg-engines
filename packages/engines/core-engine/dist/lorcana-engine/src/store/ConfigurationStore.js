import { makeAutoObservable } from "mobx";
// This store holds player's configuration settings.
export class ConfigurationStore {
    observable = false;
    autoTarget = true;
    autoAcceptOptionals = true;
    constructor(observable) {
        if (observable) {
            makeAutoObservable(this);
        }
        this.observable = observable;
        this.autoTarget = false;
        this.autoAcceptOptionals = false;
    }
}
//# sourceMappingURL=ConfigurationStore.js.map