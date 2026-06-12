import type { ActionCard } from "@tcg/lorcana-types";
import { improvise as canonicalImprovise } from "../../002";

export const improvise: ActionCard = {
  ...canonicalImprovise,
  id: "9XU",
  reprints: ["set2-099", "set9-096"],
  set: "009",
  cardNumber: 96,
  rarity: "common",
  externalIds: {
    lorcast: "crd_856e21edc8814f10863eae7f75635f23",
    tcgPlayer: 650034,
  },
};
