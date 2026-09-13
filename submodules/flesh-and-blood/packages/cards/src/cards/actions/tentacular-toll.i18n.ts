import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tentacularToll } from "./tentacular-toll.ts";

export const tentacularTollI18n = defineFamilyI18n(tentacularToll, {
  en: {
    name: "Tentacular Toll",
    text: ({ value1 }) =>
      `Turn up to ${value1} ally cards in your graveyard face-down, then create that many Gold tokens.
Go again`,
    typeText: "Pirate Necromancer Action",
  },
});

export const {
  red: tentacularTollRedI18n,
  yellow: tentacularTollYellowI18n,
  blue: tentacularTollBlueI18n,
} = tentacularTollI18n.cards;
