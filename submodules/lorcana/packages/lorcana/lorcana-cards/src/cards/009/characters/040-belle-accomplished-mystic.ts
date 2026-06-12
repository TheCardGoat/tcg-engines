import type { CharacterCard } from "@tcg/lorcana-types";
import { belleAccomplishedMystic as canonicalBelleAccomplishedMystic } from "../../004";

export const belleAccomplishedMystic: CharacterCard = {
  ...canonicalBelleAccomplishedMystic,
  id: "m95",
  reprints: ["set4-036", "set9-040"],
  set: "009",
  cardNumber: 40,
  rarity: "common",
  externalIds: {
    lorcast: "crd_c51b6a26015b45f298d1664787f37234",
    tcgPlayer: 651121,
  },
};
