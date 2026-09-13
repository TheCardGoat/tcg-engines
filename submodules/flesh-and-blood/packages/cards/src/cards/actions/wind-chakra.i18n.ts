import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { windChakra } from "./wind-chakra.ts";

export const windChakraI18n = defineFamilyI18n(windChakra, {
  en: {
    name: "Wind Chakra",
    text: ({ bonus, transcendedBonus }) =>
      `The next Crouching Tiger you play this turn gets +${bonus}{p}. If you've transcended this turn, instead it gets +${transcendedBonus}{p}.`,
    typeText: "Mystic Ninja Action",
  },
});

export const {
  red: windChakraRedI18n,
  yellow: windChakraYellowI18n,
  blue: windChakraBlueI18n,
} = windChakraI18n.cards;
