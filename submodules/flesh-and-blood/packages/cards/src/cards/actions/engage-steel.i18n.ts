import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { engageSteel } from "./engage-steel.ts";

export const engageSteelI18n = defineFamilyI18n(engageSteel, {
  en: {
    name: "Engage Steel",
    typeText: "Warrior Action",
    text: (amount) =>
      `Your next sword attack this turn gets +${amount}{p} and "If this is defended by a Warrior card, this gets +1{p}."\nGo again`,
  },
});

export const {
  red: engageSteelRedI18n,
  yellow: engageSteelYellowI18n,
  blue: engageSteelBlueI18n,
} = engageSteelI18n.cards;
