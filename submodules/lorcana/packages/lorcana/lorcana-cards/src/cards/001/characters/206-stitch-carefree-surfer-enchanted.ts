import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSurfer } from "./021-stitch-carefree-surfer";

export const stitchCarefreeSurferEnchanted: CharacterCard = {
  ...stitchCarefreeSurfer,
  id: "tQU",
  reprints: ["set1-021", "set9-024"],
  set: "001",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_fdaea5bd7f31497a8284771dd57894cf",
    tcgPlayer: 649972,
  },
};
