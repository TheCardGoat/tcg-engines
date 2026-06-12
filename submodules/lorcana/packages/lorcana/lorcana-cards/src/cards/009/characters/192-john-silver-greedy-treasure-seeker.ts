import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverGreedyTreasureSeeker as canonicalJohnSilverGreedyTreasureSeeker } from "../../003";

export const johnSilverGreedyTreasureSeeker: CharacterCard = {
  ...canonicalJohnSilverGreedyTreasureSeeker,
  id: "7ah",
  reprints: ["set3-176", "set9-192"],
  set: "009",
  cardNumber: 192,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_8db5f81d06034612b857a11fc606c5d2",
    tcgPlayer: 650125,
  },
};
