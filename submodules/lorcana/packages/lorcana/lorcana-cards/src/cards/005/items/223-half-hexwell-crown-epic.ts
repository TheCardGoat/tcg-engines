import type { ItemCard } from "@tcg/lorcana-types";
import { halfHexwellCrown } from "./065-half-hexwell-crown";

export const halfHexwellCrownEpic: ItemCard = {
  ...halfHexwellCrown,
  id: "96K",
  reprints: ["set5-065"],
  set: "005",
  cardNumber: 223,
  rarity: "rare",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_cbd6fc9596f14329af2f0c237a7be6a2",
    tcgPlayer: 557538,
  },
};
