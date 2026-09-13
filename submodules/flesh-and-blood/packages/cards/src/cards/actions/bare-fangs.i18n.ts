import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bareFangs } from "./bare-fangs.ts";

export const bareFangsI18n = defineFamilyI18n(bareFangs, {
  en: {
    name: "Bare Fangs",
    text: "When this attacks, draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, Bare Fangs gains +2{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: bareFangsRedI18n,
  yellow: bareFangsYellowI18n,
  blue: bareFangsBlueI18n,
} = bareFangsI18n.cards;
