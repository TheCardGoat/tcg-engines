import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarRoyalVizier as canonicalJafarRoyalVizier } from "../../002";

export const jafarRoyalVizier: CharacterCard = {
  ...canonicalJafarRoyalVizier,
  id: "6qK",
  reprints: ["set2-184", "set9-181"],
  set: "009",
  cardNumber: 181,
  rarity: "common",
  externalIds: {
    lorcast: "crd_7d0510c02fca4d878ec8a11ed836ae80",
    tcgPlayer: 650114,
  },
};
