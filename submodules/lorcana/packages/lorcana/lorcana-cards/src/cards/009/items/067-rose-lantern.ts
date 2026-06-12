import type { ItemCard } from "@tcg/lorcana-types";
import { roseLantern as canonicalRoseLantern } from "../../004";

export const roseLantern: ItemCard = {
  ...canonicalRoseLantern,
  id: "LJ1",
  reprints: ["set4-065", "set9-067"],
  set: "009",
  cardNumber: 67,
  rarity: "common",
  externalIds: {
    lorcast: "crd_0294484e638d4f389732639af2b5d5e8",
    tcgPlayer: 647667,
  },
};
