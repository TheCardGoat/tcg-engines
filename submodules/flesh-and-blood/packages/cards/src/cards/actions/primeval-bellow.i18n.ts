import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { primevalBellow } from "./primeval-bellow.ts";

export const primevalBellowI18n = defineFamilyI18n(primevalBellow, {
  en: {
    name: "Primeval Bellow",
    typeText: "Brute Action",
    text: (amount) =>
      `As an additional cost to play Primeval Bellow, discard a random card.\nYour next Brute attack this turn gains +${amount}{p}.\nGo again`,
  },
});

export const {
  red: primevalBellowRedI18n,
  yellow: primevalBellowYellowI18n,
  blue: primevalBellowBlueI18n,
} = primevalBellowI18n.cards;
