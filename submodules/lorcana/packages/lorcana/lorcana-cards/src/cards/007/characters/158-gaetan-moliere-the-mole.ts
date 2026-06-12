import type { CharacterCard } from "@tcg/lorcana-types";
import { gaetanMoliereTheMoleI18n } from "./158-gaetan-moliere-the-mole.i18n";

export const gaetanMoliereTheMole: CharacterCard = {
  id: "ex2",
  canonicalId: "ci_ex2",
  reprints: ["set7-158"],
  cardType: "character",
  name: "Gaetan Moliere",
  version: "The Mole",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 158,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_097da6b8bdc94d0f8accc703735147e5",
    tcgPlayer: 619496,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: gaetanMoliereTheMoleI18n,
};
