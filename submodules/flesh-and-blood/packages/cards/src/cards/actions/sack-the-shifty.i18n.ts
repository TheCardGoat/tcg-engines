import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sackTheShifty } from "./sack-the-shifty.ts";

export const sackTheShiftyI18n = defineFamilyI18n(sackTheShifty, {
  en: {
    name: "Sack the Shifty",
    text: "Contract - You are contracted to banish opponents' cards with base go again. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: sackTheShiftyRedI18n,
  yellow: sackTheShiftyYellowI18n,
  blue: sackTheShiftyBlueI18n,
} = sackTheShiftyI18n.cards;
