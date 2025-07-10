import { makeAutoObservable } from "mobx";

// This store holds player's configuration settings.
export class ConfigurationStore {
  private readonly observable: boolean = false;
  autoTarget = true;
  autoAcceptOptionals = true;

  constructor(observable: boolean) {
    if (observable) {
      makeAutoObservable(this);
    }

    this.observable = observable;
    this.autoTarget = false;
    this.autoAcceptOptionals = false;
  }
}
