import type { Meta, MobXRootStore } from "@lorcanito/lorcana-engine";
import { makeAutoObservable, toJS } from "mobx";

type MetaModel = Omit<Meta, "continuousEffects">;

// We're using null in this type, because firebase will remove the entire field if it's null
export class CardMetaModel {
  exerted?: boolean | null = undefined;
  playedThisTurn?: boolean | null = undefined;
  damage?: number | null = undefined;
  shifter?: string | null = undefined;
  shifted?: string | null = undefined;
  revealed?: boolean | null = undefined;

  location?: string | null = undefined;
  characters?: string[] | null = undefined;
  private readonly rootStore: MobXRootStore;

  constructor(
    meta: Meta | undefined | null,
    observable: boolean,
    rootStore: MobXRootStore,
  ) {
    if (observable) {
      makeAutoObservable<CardMetaModel, "rootStore">(this, {
        rootStore: false,
      });
    }

    this.rootStore = rootStore;

    this.sync(meta);
  }

  resetMeta() {
    this.exerted = undefined;
    this.playedThisTurn = undefined;
    this.damage = undefined;
    this.shifter = undefined;
    this.shifted = undefined;
    this.revealed = undefined;
    this.location = undefined;
    this.characters = undefined;
  }

  update(meta: Partial<CardMetaModel>) {
    Object.assign(this, meta);
  }

  sync(meta: Meta | undefined | null) {
    if (!meta) {
      this.resetMeta();
    }

    this.exerted = meta?.exerted ?? undefined;
    this.playedThisTurn = meta?.playedThisTurn ?? undefined;
    this.damage = meta?.damage ?? undefined;
    this.shifter = meta?.shifter ?? undefined;
    this.shifted = meta?.shifted ?? undefined;
    this.revealed = meta?.revealed ?? undefined;
    this.location = meta?.location ?? undefined;
    this.characters = meta?.characters ?? undefined;
  }

  toJSON() {
    const json: Meta = toJS({
      exerted: this.exerted || null,
      playedThisTurn: this.playedThisTurn || null,
      damage: this.damage || null,
      shifter: this.shifter || null,
      shifted: this.shifted || null,
      revealed: this.revealed || null,
      location: this.location || null,
      characters: this.characters || null,
    });

    if (json.characters?.length === 0) {
      delete json.characters;
    }

    (Object.keys(json) as Array<keyof Meta>).forEach((key) => {
      if (!json[key]) {
        delete json[key];
      }
    });

    if (Object.keys(json).length === 0) {
      return undefined;
    }

    return json;
  }
}
