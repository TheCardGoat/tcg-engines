import type { CharacterCard } from "@tcg/lorcana-types";
import { bambiPrinceOfTheForestI18n } from "./057-bambi-prince-of-the-forest.i18n";

export const bambiPrinceOfTheForest: CharacterCard = {
  id: "wU9",
  canonicalId: "ci_wU9",
  reprints: ["set8-057"],
  cardType: "character",
  name: "Bambi",
  version: "Prince of the Forest",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 57,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_83fb168f74ce49fa9c92000143bf3402",
    tcgPlayer: 631339,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: bambiPrinceOfTheForestI18n,
};
