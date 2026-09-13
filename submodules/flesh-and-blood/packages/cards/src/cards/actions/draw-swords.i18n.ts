import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drawSwords } from "./draw-swords.ts";

export const drawSwordsI18n = defineFamilyI18n(drawSwords, {
  en: {
    name: "Draw Swords",
    text: (amount) =>
      `Your next Warrior attack this turn gets +${amount}{p}.\nDraw a card.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: drawSwordsRedI18n,
  yellow: drawSwordsYellowI18n,
  blue: drawSwordsBlueI18n,
} = drawSwordsI18n.cards;
