import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { engulfingFlamewave } from "./engulfing-flamewave.ts";

export const engulfingFlamewaveI18n = defineFamilyI18n(engulfingFlamewave, {
  en: {
    name: "Engulfing Flamewave",
    text: "When this hits, reveal the top card of your deck. If it's an attack action card with cost less than number of Draconic chain links you control, banish it. You may play it this turn.\nGo again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: engulfingFlamewaveRedI18n,
  yellow: engulfingFlamewaveYellowI18n,
  blue: engulfingFlamewaveBlueI18n,
} = engulfingFlamewaveI18n.cards;
