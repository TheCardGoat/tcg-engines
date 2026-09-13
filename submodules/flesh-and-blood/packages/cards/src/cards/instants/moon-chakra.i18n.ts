import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { moonChakra } from "./moon-chakra.ts";

export const moonChakraI18n = defineFamilyI18n(moonChakra, {
  en: {
    name: "Moon Chakra",
    typeText: "Mystic Illusionist Instant",
    text: ({ baseAmount, transcendedAmount }) =>
      `The next time you would be dealt damage this turn, prevent ${baseAmount} of that damage. If you've transcended this turn, instead prevent ${transcendedAmount}.`,
  },
});

export const {
  red: moonChakraRedI18n,
  yellow: moonChakraYellowI18n,
  blue: moonChakraBlueI18n,
} = moonChakraI18n.cards;
