import { Derived, Store } from "@tanstack/store";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import { hash } from "~/game-engine/core-engine/state/state-hash";

export class GameStateStore<G = unknown> {
  private store: Store<CoreEngineState<G>>;
  private derivedHash: Derived<string>;

  constructor({
    initialState,
  }: {
    initialState: CoreEngineState<G>;
  }) {
    this.store = new Store<CoreEngineState<G>>(initialState);

    this.derivedHash = new Derived({
      fn: () => hash(this.store.state),
      deps: [this.store],
    });

    this.derivedHash.mount();
  }

  get state(): CoreEngineState<G> {
    return this.store.state;
  }

  getState(): CoreEngineState<G> {
    return this.store.state;
  }

  get stateHash(): string {
    return this.derivedHash.state;
  }

  updateState({ newState }: { newState: CoreEngineState<G> }) {
    this.store.setState(() => newState);
  }
}
