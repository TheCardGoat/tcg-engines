import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodDaydreamer as canonicalRobinHoodDaydreamer } from "../../003";

export const robinHoodDaydreamer: CharacterCard = {
  ...canonicalRobinHoodDaydreamer,
  id: "a5G",
  reprints: ["set3-084", "set9-070"],
  set: "009",
  cardNumber: 70,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_93d3181a0964484f8c491f7b96dd7d02",
    tcgPlayer: 650012,
  },
};
