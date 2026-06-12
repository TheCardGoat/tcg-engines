import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckPerfectGentleman as canonicalDonaldDuckPerfectGentleman } from "../../002";

export const donaldDuckPerfectGentleman: CharacterCard = {
  ...canonicalDonaldDuckPerfectGentleman,
  id: "op2",
  reprints: ["set2-077", "set9-085"],
  set: "009",
  cardNumber: 85,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_0fbd5245e47044bc842780f9340d4ddd",
    tcgPlayer: 650025,
  },
};
