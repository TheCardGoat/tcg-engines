import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaHappygoluckyI18n } from "./005-simba-happy-go-lucky.i18n";

export const simbaHappygolucky: CharacterCard = {
  id: "FnI",
  canonicalId: "ci_FnI",
  reprints: ["set6-005"],
  cardType: "character",
  name: "Simba",
  version: "Happy-Go-Lucky",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 5,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_88538250940d4c2c8b56b60aaeb07674",
    tcgPlayer: 586882,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: simbaHappygoluckyI18n,
};
