import type { CharacterCard } from "@tcg/lorcana-types";
import { gusChampionOfCheeseI18n } from "./073-gus-champion-of-cheese.i18n";

export const gusChampionOfCheese: CharacterCard = {
  id: "wxy",
  canonicalId: "ci_wxy",
  reprints: ["set4-073"],
  cardType: "character",
  name: "Gus",
  version: "Champion of Cheese",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "004",
  cardNumber: 73,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_773d33f2fd1e4f54b3a47363b31ebce1",
    tcgPlayer: 549680,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: gusChampionOfCheeseI18n,
};
