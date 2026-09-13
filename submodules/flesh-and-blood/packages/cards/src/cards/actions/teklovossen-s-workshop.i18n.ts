import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { teklovossenSWorkshop } from "./teklovossen-s-workshop.ts";

export const teklovossenSWorkshopI18n = defineFamilyI18n(teklovossenSWorkshop, {
  en: {
    name: "Teklovossen's Workshop",
    text: ({ value2 }) =>
      `Opt X, where X is the number of times you have boosted this turn.\nReveal the top card of your deck. If it's a Mechanologist item card with cost ${value2}${value2 === 0 ? "" : " or less"}, put it into the arena.`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: teklovossenSWorkshopRedI18n,
  yellow: teklovossenSWorkshopYellowI18n,
  blue: teklovossenSWorkshopBlueI18n,
} = teklovossenSWorkshopI18n.cards;
