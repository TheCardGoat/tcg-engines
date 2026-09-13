import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutToTheChase } from "./cut-to-the-chase.ts";

export const cutToTheChaseI18n = defineFamilyI18n(cutToTheChase, {
  en: {
    name: "Cut to the Chase",
    typeText: "Assassin Attack Reaction",
    text: (amount) =>
      `Target Assassin attack action card with contract gains +${amount}{p}. Look at the top card of the defending hero's deck. You may put it on the bottom.`,
  },
});
export const {
  red: cutToTheChaseRedI18n,
  yellow: cutToTheChaseYellowI18n,
  blue: cutToTheChaseBlueI18n,
} = cutToTheChaseI18n.cards;
