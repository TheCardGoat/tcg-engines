import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { barragingBeatdown } from "./barraging-beatdown.ts";

export const barragingBeatdownI18n = defineFamilyI18n(barragingBeatdown, {
  en: {
    name: "Barraging Beatdown",
    text: (amount) =>
      `Your next Brute attack this turn gains "While this attack is defended by less than 2 non-equipment cards, it has +${amount}{p}."\nIntimidate\nGo again`,
    typeText: "Brute Action",
  },
});

export const {
  red: barragingBeatdownRedI18n,
  yellow: barragingBeatdownYellowI18n,
  blue: barragingBeatdownBlueI18n,
} = barragingBeatdownI18n.cards;
