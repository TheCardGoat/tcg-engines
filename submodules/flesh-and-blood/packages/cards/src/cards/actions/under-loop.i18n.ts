import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { underLoop } from "./under-loop.ts";

export const underLoopI18n = defineFamilyI18n(underLoop, {
  en: {
    name: "Under Loop",
    text: "Boost\nWhen this hits, put it on the bottom of its owner's deck.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: underLoopRedI18n,
  yellow: underLoopYellowI18n,
  blue: underLoopBlueI18n,
} = underLoopI18n.cards;
