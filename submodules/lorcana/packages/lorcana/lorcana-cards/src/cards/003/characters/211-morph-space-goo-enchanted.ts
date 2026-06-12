import type { CharacterCard } from "@tcg/lorcana-types";
import { morphSpaceGoo } from "./081-morph-space-goo";

export const morphSpaceGooEnchanted: CharacterCard = {
  ...morphSpaceGoo,
  id: "UdW",
  reprints: ["set3-081"],
  set: "003",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_2e1d43823fc642549ba92787523ce17f",
    tcgPlayer: 539163,
  },
};
