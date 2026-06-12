import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoWantedLlama as canonicalKuzcoWantedLlama } from "../../002";

export const kuzcoWantedLlama: CharacterCard = {
  ...canonicalKuzcoWantedLlama,
  id: "mBW",
  reprints: ["set2-045", "set9-049"],
  set: "009",
  cardNumber: 49,
  rarity: "common",
  externalIds: {
    lorcast: "crd_21489dcd479a4d209a1b740f356fff6f",
    tcgPlayer: 647657,
  },
};
