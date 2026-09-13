import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { awakeningBellow } from "./awakening-bellow.ts";

export const awakeningBellowI18n = defineFamilyI18n(awakeningBellow, {
  en: {
    name: "Awakening Bellow",
    text: (amount) =>
      `The next Brute attack action card you play this turn gains +${amount}{p}.\nIntimidate\nGo again`,
    typeText: "Brute Action",
  },
});

export const {
  red: awakeningBellowRedI18n,
  yellow: awakeningBellowYellowI18n,
  blue: awakeningBellowBlueI18n,
} = awakeningBellowI18n.cards;
