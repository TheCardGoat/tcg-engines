import type { CharacterCard } from "@tcg/lorcana-types";
import { caterpillarCalmAndCollectedI18n } from "./141-caterpillar-calm-and-collected.i18n";

export const caterpillarCalmAndCollected: CharacterCard = {
  id: "NTh",
  canonicalId: "ci_NTh",
  reprints: ["set2-141"],
  cardType: "character",
  name: "Caterpillar",
  version: "Calm and Collected",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 141,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f3402d0395ee4f5c8fe1c1f897f6e06e",
    tcgPlayer: 527762,
  },
  classifications: ["Dreamborn"],
  i18n: caterpillarCalmAndCollectedI18n,
};
