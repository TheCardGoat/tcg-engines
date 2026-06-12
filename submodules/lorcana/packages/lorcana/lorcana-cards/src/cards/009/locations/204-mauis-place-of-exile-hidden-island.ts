import type { LocationCard } from "@tcg/lorcana-types";
import { mauisPlaceOfExileHiddenIsland as canonicalMauisPlaceOfExileHiddenIsland } from "../../003";

export const mauisPlaceOfExileHiddenIsland: LocationCard = {
  ...canonicalMauisPlaceOfExileHiddenIsland,
  id: "3Ro",
  reprints: ["set3-202", "set9-204"],
  set: "009",
  cardNumber: 204,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_f2169b618849493a969102f760825622",
    tcgPlayer: 650136,
  },
};
