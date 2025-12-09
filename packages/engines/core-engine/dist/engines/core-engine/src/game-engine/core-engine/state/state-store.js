import { Derived, Store } from "@tanstack/store";
import { hash } from "~/game-engine/core-engine/state/state-hash";
export class GameStateStore {
    store;
    derivedHash;
    constructor({ initialState, }) {
        this.store = new Store(initialState);
        this.derivedHash = new Derived({
            fn: () => hash(this.store.state),
            deps: [this.store],
        });
        this.derivedHash.mount();
    }
    get state() {
        return this.store.state;
    }
    getState() {
        return this.store.state;
    }
    get stateHash() {
        return this.derivedHash.state;
    }
    updateState({ newState }) {
        this.store.setState(() => newState);
    }
}
//# sourceMappingURL=state-store.js.map