import type { LocationCard } from "@tcg/lorcana-types";
import { hiddenCoveTranquilHaven as canonicalHiddenCoveTranquilHaven } from "../../004";

export const hiddenCoveTranquilHaven: LocationCard = {
  ...canonicalHiddenCoveTranquilHaven,
  id: "ejC",
  reprints: ["set4-101", "set9-102"],
  set: "009",
  cardNumber: 102,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a7b30a7923bd4b3596c48ede7e6b438e",
    tcgPlayer: 650040,
  },
};
