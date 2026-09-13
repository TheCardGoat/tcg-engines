import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingResentment } from "./rising-resentment.ts";

export const risingResentmentI18n = defineFamilyI18n(risingResentment, {
  en: {
    name: "Rising Resentment",
    text: "When this hits, you may banish an attack action card from your hand with cost less than the number of Draconic chain links you control. If you do, it costs {r} less to play and you may play it this turn.\nGo again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: risingResentmentRedI18n,
  yellow: risingResentmentYellowI18n,
  blue: risingResentmentBlueI18n,
} = risingResentmentI18n.cards;
