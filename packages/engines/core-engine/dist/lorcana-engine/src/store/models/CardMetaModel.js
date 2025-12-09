import { makeAutoObservable, toJS } from "mobx";
// We're using null in this type, because firebase will remove the entire field if it's null
export class CardMetaModel {
    exerted = undefined;
    playedThisTurn = undefined;
    damage = undefined;
    shifter = undefined;
    shifted = undefined;
    revealed = undefined;
    location = undefined;
    characters = undefined;
    rootStore;
    constructor(meta, observable, rootStore) {
        if (observable) {
            makeAutoObservable(this, {
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
    update(meta) {
        Object.assign(this, meta);
    }
    sync(meta) {
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
        const json = toJS({
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
        Object.keys(json).forEach((key) => {
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
//# sourceMappingURL=CardMetaModel.js.map