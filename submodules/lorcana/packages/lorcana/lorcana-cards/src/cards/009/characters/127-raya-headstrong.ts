import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaHeadstrong as canonicalRayaHeadstrong } from "../../002";

export const rayaHeadstrong: CharacterCard = {
  ...canonicalRayaHeadstrong,
  id: "k7Z",
  reprints: ["set2-122", "set9-127"],
  set: "009",
  cardNumber: 127,
  rarity: "common",
  externalIds: {
    lorcast: "crd_f658a42763fe4f4bbd7e0605d2fb1e2f",
    tcgPlayer: 650062,
  },
};
