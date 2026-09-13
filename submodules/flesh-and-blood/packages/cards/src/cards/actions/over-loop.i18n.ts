import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overLoop } from "./over-loop.ts";

export const overLoopI18n = defineFamilyI18n(overLoop, {
  en: {
    name: "Over Loop",
    text: "Boost\nWhen this hits, put it on the bottom of its owner's deck.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: overLoopRedI18n,
  yellow: overLoopYellowI18n,
  blue: overLoopBlueI18n,
} = overLoopI18n.cards;
