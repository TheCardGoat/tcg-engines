import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelSunshine as canonicalRapunzelSunshine } from "../../002";

export const rapunzelSunshine: CharacterCard = {
  ...canonicalRapunzelSunshine,
  id: "Cwj",
  reprints: ["set2-020", "set9-008"],
  set: "009",
  cardNumber: 8,
  rarity: "common",
  externalIds: {
    lorcast: "crd_ecef763660c74bd49ddb8930fb0ff10b",
    tcgPlayer: 649957,
  },
};
