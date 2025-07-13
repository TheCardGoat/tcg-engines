import { Derived, Store } from "@tanstack/store";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import { hash } from "~/game-engine/core-engine/state/state-hash";

export class GameStateStore<G = unknown, P = unknown> {
  private store: Store<CoreEngineState<G, P>>;
  private derivedHash: Derived<string>;

  constructor({
    initialState,
  }: {
    initialState: CoreEngineState<G, P>;
  }) {
    this.store = new Store<CoreEngineState<G, P>>(initialState);

    this.derivedHash = new Derived({
      fn: () => hash(this.store.state),
      deps: [this.store],
    });

    this.derivedHash.mount();
  }

  get state(): CoreEngineState<G, P> {
    return this.store.state;
  }

  getState(): CoreEngineState<G, P> {
    return this.store.state;
  }

  get stateHash(): string {
    return this.derivedHash.state;
  }

  updateState({ newState }: { newState: CoreEngineState<G, P> }) {
    this.store.setState(() => newState);
  }
}
