import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tideChakra } from "./tide-chakra.ts";

export const tideChakraI18n = defineFamilyI18n(tideChakra, {
  en: {
    name: "Tide Chakra",
    typeText: "Mystic Assassin Attack Reaction",
    text: (amount) =>
      `Target Assassin or Mystic attack action card gets +${amount}{p}. If you've transcended this turn, instead it gets +${amount + 2}{p}.`,
  },
});
export const {
  red: tideChakraRedI18n,
  yellow: tideChakraYellowI18n,
  blue: tideChakraBlueI18n,
} = tideChakraI18n.cards;
