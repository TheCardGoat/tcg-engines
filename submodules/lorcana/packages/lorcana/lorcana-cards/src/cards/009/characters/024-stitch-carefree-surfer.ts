import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSurfer as canonicalStitchCarefreeSurfer } from "../../001";

export const stitchCarefreeSurfer: CharacterCard = {
  ...canonicalStitchCarefreeSurfer,
  id: "PYw",
  reprints: ["set1-021", "set9-024"],
  set: "009",
  cardNumber: 24,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_fdaea5bd7f31497a8284771dd57894cf",
    tcgPlayer: 649972,
  },
};
