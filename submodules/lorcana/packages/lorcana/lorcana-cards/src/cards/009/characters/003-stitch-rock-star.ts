import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchRockStar as canonicalStitchRockStar } from "../../001";

export const stitchRockStar: CharacterCard = {
  ...canonicalStitchRockStar,
  id: "F34",
  reprints: ["set1-023", "set9-003"],
  set: "009",
  cardNumber: 3,
  rarity: "common",
  externalIds: {
    lorcast: "crd_1135ff76d7504441942b3f9e9edae58d",
    tcgPlayer: 649952,
  },
};
