import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraHoldingCourt } from "./006-aurora-holding-court";

export const auroraHoldingCourtEpic: CharacterCard = {
  ...auroraHoldingCourt,
  id: "WTH",
  reprints: ["set9-006"],
  set: "009",
  cardNumber: 206,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_d292fcaa144d4f739bda2c14948da2ce",
    tcgPlayer: 650142,
  },
};
