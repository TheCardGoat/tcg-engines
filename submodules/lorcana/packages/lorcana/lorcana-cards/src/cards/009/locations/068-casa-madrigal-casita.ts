import type { LocationCard } from "@tcg/lorcana-types";
import { casaMadrigalCasita as canonicalCasaMadrigalCasita } from "../../004";

export const casaMadrigalCasita: LocationCard = {
  ...canonicalCasaMadrigalCasita,
  id: "9E7",
  reprints: ["set4-067", "set9-068"],
  set: "009",
  cardNumber: 68,
  rarity: "common",
  externalIds: {
    lorcast: "crd_3badd6eb64ca49b18e7ee2cefea06b46",
    tcgPlayer: 650010,
  },
};
