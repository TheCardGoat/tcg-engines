import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessLooter } from "./restless-looter.ts";

export const restlessLooterI18n = defineFamilyI18n(restlessLooter, {
  en: {
    name: "Restless Looter",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Instant - {t}, Discard a card. If you do, draw a card.\nDecay",
    abilities: {
      discardThenDraw: { displayName: "Discard, then draw" },
    },
  },
});
export const { red: restlessLooterRedI18n } = restlessLooterI18n.cards;
