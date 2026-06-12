import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseDetective as canonicalMickeyMouseDetective } from "../../001";

export const mickeyMouseDetective: CharacterCard = {
  ...canonicalMickeyMouseDetective,
  id: "jRJ",
  reprints: ["set1-154", "set10-160"],
  set: "010",
  cardNumber: 160,
  rarity: "common",
  externalIds: {
    lorcast: "crd_9b6f273381924929ba2d6f6d3e990f66",
    tcgPlayer: 659388,
  },
};
