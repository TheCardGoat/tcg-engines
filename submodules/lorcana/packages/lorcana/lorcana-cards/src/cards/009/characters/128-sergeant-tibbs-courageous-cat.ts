import type { CharacterCard } from "@tcg/lorcana-types";
import { sergeantTibbsCourageousCat as canonicalSergeantTibbsCourageousCat } from "../../001";

export const sergeantTibbsCourageousCat: CharacterCard = {
  ...canonicalSergeantTibbsCourageousCat,
  id: "YfM",
  reprints: ["set1-124", "set9-128"],
  set: "009",
  cardNumber: 128,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d86fe241e2434bc49ee61f5516366f08",
    tcgPlayer: 650063,
  },
};
