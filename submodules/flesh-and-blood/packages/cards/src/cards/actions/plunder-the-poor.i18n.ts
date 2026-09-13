import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plunderThePoor } from "./plunder-the-poor.ts";

export const plunderThePoorI18n = defineFamilyI18n(plunderThePoor, {
  en: {
    name: "Plunder the Poor",
    text: "Contract - You are contracted to banish opponents' cards with cost 1 or less. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: plunderThePoorRedI18n,
  yellow: plunderThePoorYellowI18n,
  blue: plunderThePoorBlueI18n,
} = plunderThePoorI18n.cards;
