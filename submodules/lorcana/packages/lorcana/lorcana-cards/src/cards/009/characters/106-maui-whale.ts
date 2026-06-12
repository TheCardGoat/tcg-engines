import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiWhale as canonicalMauiWhale } from "../../003";

export const mauiWhale: CharacterCard = {
  ...canonicalMauiWhale,
  id: "q1K",
  reprints: ["set3-114", "set9-106"],
  set: "009",
  cardNumber: 106,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_eca6a044a1a24319948f3c2698344fad",
    tcgPlayer: 650044,
  },
};
