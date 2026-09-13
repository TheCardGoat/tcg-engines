import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bearHug } from "./bear-hug.ts";

export const bearHugI18n = defineFamilyI18n(bearHug, {
  en: {
    name: "Bear Hug",
    text: "Play this only if you've pitched a card with 6 or more {p} this turn.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: bearHugRedI18n,
  yellow: bearHugYellowI18n,
  blue: bearHugBlueI18n,
} = bearHugI18n.cards;
