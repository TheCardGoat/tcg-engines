import type { CharacterCard } from "@tcg/lorcana-types";
import { pongoDeterminedFather as canonicalPongoDeterminedFather } from "../../003";

export const pongoDeterminedFather: CharacterCard = {
  ...canonicalPongoDeterminedFather,
  id: "dkv",
  reprints: ["set3-019", "set9-002"],
  set: "009",
  cardNumber: 2,
  rarity: "common",
  externalIds: {
    lorcast: "crd_c233fd3627b24b02bd616aa62bbdc83a",
    tcgPlayer: 651110,
  },
};
