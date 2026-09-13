import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { barragingBrawnhide } from "./barraging-brawnhide.ts";

export const barragingBrawnhideI18n = defineFamilyI18n(barragingBrawnhide, {
  en: {
    name: "Barraging Brawnhide",
    text: "While Barraging Brawnhide is defended by less than 2 non-equipment cards, it has +1{p}.",
    typeText: "Generic Action - Attack",
  },
});
export const {
  red: barragingBrawnhideRedI18n,
  yellow: barragingBrawnhideYellowI18n,
  blue: barragingBrawnhideBlueI18n,
} = barragingBrawnhideI18n.cards;
