import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanPiratesBane } from "./120-peter-pan-pirates-bane";

export const peterPanPiratesBaneEnchanted: CharacterCard = {
  ...peterPanPiratesBane,
  id: "lkh",
  reprints: ["set3-120"],
  set: "003",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b5e74b533270492982dff9472aee8664",
    tcgPlayer: 539274,
  },
};
