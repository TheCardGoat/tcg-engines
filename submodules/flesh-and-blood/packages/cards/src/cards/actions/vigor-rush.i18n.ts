import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vigorRush } from "./vigor-rush.ts";

export const vigorRushI18n = defineFamilyI18n(vigorRush, {
  en: {
    name: "Vigor Rush",
    text: "If you have played a 'non-attack' action card this turn, Vigor Rush gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: vigorRushRedI18n,
  yellow: vigorRushYellowI18n,
  blue: vigorRushBlueI18n,
} = vigorRushI18n.cards;
