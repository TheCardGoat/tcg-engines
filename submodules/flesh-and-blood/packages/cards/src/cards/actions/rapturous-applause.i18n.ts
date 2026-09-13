import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rapturousApplause } from "./rapturous-applause.ts";

export const rapturousApplauseI18n = defineFamilyI18n(rapturousApplause, {
  en: {
    name: "Rapturous Applause",
    text: "When you win a clash revealing this, the crowd cheers you.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: rapturousApplauseRedI18n,
  yellow: rapturousApplauseYellowI18n,
  blue: rapturousApplauseBlueI18n,
} = rapturousApplauseI18n.cards;
