import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { slayTheScholars } from "./slay-the-scholars.ts";

export const slayTheScholarsI18n = defineFamilyI18n(slayTheScholars, {
  en: {
    name: "Slay the Scholars",
    text: "Contract - You are contracted to banish opponents' 'non-attack' action cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: slayTheScholarsRedI18n,
  yellow: slayTheScholarsYellowI18n,
  blue: slayTheScholarsBlueI18n,
} = slayTheScholarsI18n.cards;
