import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { makeAutoObservable } from "mobx";
export class ZoneModel {
    zone;
    cards;
    ownerId;
    rootStore;
    constructor(zone, cards, ownerId, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this);
        }
        this.zone = zone;
        this.cards = cards;
        this.ownerId = ownerId;
        this.rootStore = rootStore;
    }
    sync(zone) {
        if (zone) {
            this.cards = zone
                .map((cardId) => this.rootStore.cardStore.cards[cardId])
                .filter(notEmptyPredicate);
        }
        else {
            this.cards = [];
        }
    }
    toJSON() {
        if (!this.cards) {
            return [];
        }
        return this.cards.map((card) => card.instanceId);
    }
    hasCard(card) {
        return !!this.cards.find((c) => c.instanceId === card.instanceId);
    }
    inkAvailable() {
        if (this.zone !== "inkwell") {
            return 0;
        }
        return this.cards.filter((card) => !card.meta?.exerted).length;
    }
    inkTotal() {
        if (this.zone !== "inkwell") {
            return 0;
        }
        return this.cards.length;
    }
    addCard(card, position = "last") {
        if (position === "first") {
            this.cards.unshift(card);
        }
        else {
            this.cards.push(card);
        }
    }
    removeCard(card) {
        const index = this.cards.findIndex((model) => model.instanceId === card.instanceId);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }
}
//# sourceMappingURL=ZoneModel.js.map