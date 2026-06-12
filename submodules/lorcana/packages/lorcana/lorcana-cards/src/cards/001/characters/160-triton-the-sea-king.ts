import type { CharacterCard } from "@tcg/lorcana-types";
import { tritonTheSeaKingI18n } from "./160-triton-the-sea-king.i18n";

export const tritonTheSeaKing: CharacterCard = {
  id: "0PV",
  canonicalId: "ci_0PV",
  reprints: ["set1-160"],
  cardType: "character",
  name: "Triton",
  version: "The Sea King",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 160,
  rarity: "uncommon",
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_76258afdc2084ca2b2657664bbca3efa",
    tcgPlayer: 506023,
  },
  classifications: ["Storyborn", "King"],
  i18n: tritonTheSeaKingI18n,
};
