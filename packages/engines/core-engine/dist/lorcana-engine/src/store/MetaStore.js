import { makeAutoObservable, toJS } from "mobx";
export class MetaStore {
    dependencies;
    metas;
    rootStore;
    observable;
    constructor(initialState = {}, dependencies, rootStore, observable) {
        this.rootStore = rootStore;
        this.dependencies = dependencies;
        this.metas = {};
        this.observable = observable;
        this.sync(initialState);
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                dependencies: false,
            });
        }
    }
    sync(metas = {}) {
        this.metas = {};
        this.rootStore.cardStore.getAllCards.forEach((card) => {
            card.sync(metas[card.instanceId]);
        });
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        return this.json;
    }
    get json() {
        const cards = {};
        this.rootStore.cardStore.getAllCards.forEach((card) => {
            cards[card.instanceId] = card.meta.toJSON();
        });
        return toJS(cards) || {};
    }
}
//# sourceMappingURL=MetaStore.js.map