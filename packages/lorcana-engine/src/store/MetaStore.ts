import type { CardMetaModel } from "@lorcanito/lorcana-engine/store/models/CardMetaModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";
import type { Match } from "@lorcanito/lorcana-engine/types/types";
import { makeAutoObservable, toJS } from "mobx";

export class MetaStore {
  dependencies: Dependencies;
  metas: Record<string, CardMetaModel>;

  private readonly rootStore: MobXRootStore;
  private readonly observable: boolean;

  constructor(
    initialState: Match["metas"] = {},
    dependencies: Dependencies,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    this.rootStore = rootStore;
    this.dependencies = dependencies;
    this.metas = {};
    this.observable = observable;

    this.sync(initialState);

    if (observable) {
      makeAutoObservable<MetaStore, "rootStore">(this, {
        rootStore: false,
        dependencies: false,
      });
    }
  }

  sync(metas: Match["metas"] = {}) {
    this.metas = {};

    this.rootStore.cardStore.getAllCards.forEach((card) => {
      card.sync(metas[card.instanceId]);
    });
  }

  // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
  // https://mobx.js.org/computeds.html
  toJSON(): Match["metas"] {
    return this.json;
  }

  get json() {
    const cards: Match["metas"] = {};

    this.rootStore.cardStore.getAllCards.forEach((card) => {
      cards[card.instanceId] = card.meta.toJSON();
    });

    return toJS(cards) || {};
  }
}
