import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { oathOfOak } from "./oath-of-oak.ts";

export const oathOfOakI18n = defineFamilyI18n(oathOfOak, {
  en: {
    name: "Oath of Oak",
    text: "Create 3 Embodiment of Earth tokens.",
    typeText: "Earth Action",
  },
});
export const {
  red: oathOfOakRedI18n,
  yellow: oathOfOakYellowI18n,
  blue: oathOfOakBlueI18n,
} = oathOfOakI18n.cards;
