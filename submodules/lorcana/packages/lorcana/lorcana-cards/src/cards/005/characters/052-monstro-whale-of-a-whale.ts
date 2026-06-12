import type { CharacterCard } from "@tcg/lorcana-types";
import { monstroWhaleOfAWhaleI18n } from "./052-monstro-whale-of-a-whale.i18n";

export const monstroWhaleOfAWhale: CharacterCard = {
  id: "Adw",
  canonicalId: "ci_Adw",
  reprints: ["set5-052"],
  cardType: "character",
  name: "Monstro",
  version: "Whale of a Whale",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "005",
  cardNumber: 52,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5dc832dce6f943ddbb2bcdce8893ae61",
    tcgPlayer: 559512,
  },
  classifications: ["Storyborn"],
  i18n: monstroWhaleOfAWhaleI18n,
};
