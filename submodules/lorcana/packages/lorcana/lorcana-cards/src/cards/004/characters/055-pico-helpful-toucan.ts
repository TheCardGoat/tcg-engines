import type { CharacterCard } from "@tcg/lorcana-types";
import { picoHelpfulToucanI18n } from "./055-pico-helpful-toucan.i18n";

export const picoHelpfulToucan: CharacterCard = {
  id: "Aav",
  canonicalId: "ci_Aav",
  reprints: ["set4-055"],
  cardType: "character",
  name: "Pico",
  version: "Helpful Toucan",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 55,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f71295d13f8441589472b5a993df7372",
    tcgPlayer: 550569,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: picoHelpfulToucanI18n,
};
