import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarLampThief as canonicalJafarLampThief } from "../../003";

export const jafarLampThief: CharacterCard = {
  ...canonicalJafarLampThief,
  id: "LWg",
  reprints: ["set3-041", "set9-059"],
  set: "009",
  cardNumber: 59,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_fb78447abbd740c3a3509fa91e338b4f",
    tcgPlayer: 650003,
  },
};
