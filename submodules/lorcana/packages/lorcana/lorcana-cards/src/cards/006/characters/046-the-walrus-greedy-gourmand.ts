import type { CharacterCard } from "@tcg/lorcana-types";
import { theWalrusGreedyGourmandI18n } from "./046-the-walrus-greedy-gourmand.i18n";

export const theWalrusGreedyGourmand: CharacterCard = {
  id: "2Yy",
  canonicalId: "ci_2Yy",
  reprints: ["set6-046"],
  cardType: "character",
  name: "The Walrus",
  version: "Greedy Gourmand",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 46,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_65425d8d8a8447d98f4571b7e42c8782",
    tcgPlayer: 588074,
  },
  classifications: ["Storyborn"],
  i18n: theWalrusGreedyGourmandI18n,
};
