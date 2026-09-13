import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drawnToTheBlade } from "./drawn-to-the-blade.ts";

export const drawnToTheBladeI18n = defineFamilyI18n(drawnToTheBlade, {
  en: {
    name: "Drawn to the Blade",
    typeText: "Warrior Action",
    text: "Sharpen target sword you control.\nIf it has 2 or more +1{p} counters, the next time it hits this turn, draw a card.\nGo again",
  },
});

export const { yellow: drawnToTheBladeYellowI18n } = drawnToTheBladeI18n.cards;
