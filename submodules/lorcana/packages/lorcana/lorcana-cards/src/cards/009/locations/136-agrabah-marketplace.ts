import type { LocationCard } from "@tcg/lorcana-types";
import { agrabahMarketplace as canonicalAgrabahMarketplace } from "../../003";

export const agrabahMarketplace: LocationCard = {
  ...canonicalAgrabahMarketplace,
  id: "TOS",
  reprints: ["set3-134", "set9-136"],
  set: "009",
  cardNumber: 136,
  rarity: "common",
  externalIds: {
    lorcast: "crd_6e330a06c76a4a15b2a62a2b5d25369f",
    tcgPlayer: 650071,
  },
};
