import type { ItemCard } from "@tcg/lorcana-types";
import { medallionWeights as canonicalMedallionWeights } from "../../004";

export const medallionWeights: ItemCard = {
  ...canonicalMedallionWeights,
  id: "0I6",
  reprints: ["set4-132", "set9-134"],
  set: "009",
  cardNumber: 134,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_568ccd26d0fa49ac94a67b49e599930d",
    tcgPlayer: 650069,
  },
};
