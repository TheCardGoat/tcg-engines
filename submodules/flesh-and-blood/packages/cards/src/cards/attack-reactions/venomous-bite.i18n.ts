import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { venomousBite } from "./venomous-bite.ts";

export const venomousBiteI18n = defineFamilyI18n(venomousBite, {
  en: {
    name: "Venomous Bite",
    typeText: "Mystic Assassin Attack Reaction",
    text: (amount) =>
      `Target Assassin or Mystic attack action card gets +${amount}{p}. If you've pitched a blue card this turn, create a Fang Strike in your hand.`,
  },
});
export const {
  red: venomousBiteRedI18n,
  yellow: venomousBiteYellowI18n,
  blue: venomousBiteBlueI18n,
} = venomousBiteI18n.cards;
