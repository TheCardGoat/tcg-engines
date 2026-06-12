import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesKingOfOlympus } from "./005-hades-king-of-olympus";

export const hadesKingOfOlympusEnchanted: CharacterCard = {
  ...hadesKingOfOlympus,
  id: "QmK",
  reprints: ["set1-005"],
  set: "001",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_a9c86e6316084d76a03b32be95977091",
    tcgPlayer: 510148,
  },
};
