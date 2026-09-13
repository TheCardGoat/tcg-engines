import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { baskInYourOwnGreatness } from "./bask-in-your-own-greatness.ts";

export const baskInYourOwnGreatnessI18n = defineFamilyI18n(baskInYourOwnGreatness, {
  en: {
    name: "Bask in Your Own Greatness",
    text: "When this attacks, you may pay up to {r}{r}{r}. Create that many Might tokens.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: baskInYourOwnGreatnessRedI18n,
  yellow: baskInYourOwnGreatnessYellowI18n,
  blue: baskInYourOwnGreatnessBlueI18n,
} = baskInYourOwnGreatnessI18n.cards;
