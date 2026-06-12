import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaScrappyCub as canonicalSimbaScrappyCub } from "../../003";

export const simbaScrappyCub: CharacterCard = {
  ...canonicalSimbaScrappyCub,
  id: "bO8",
  reprints: ["set3-123", "set9-105"],
  set: "009",
  cardNumber: 105,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_49d30b3074984f9288f650908b3d0654",
    tcgPlayer: 650043,
  },
};
