import type { LocationCard } from "@tcg/lorcana-types";
import { motunuiIslandParadise as canonicalMotunuiIslandParadise } from "../../003";

export const motunuiIslandParadise: LocationCard = {
  ...canonicalMotunuiIslandParadise,
  id: "77T",
  reprints: ["set3-170", "set9-170"],
  set: "009",
  cardNumber: 170,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_fc47f435832f4356ab419cf268febdb2",
    tcgPlayer: 650104,
  },
};
