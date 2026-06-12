import type { ActionCard } from "@tcg/lorcana-types";
import { beOurGuest as canonicalBeOurGuest } from "../../001";

export const beOurGuest: ActionCard = {
  ...canonicalBeOurGuest,
  id: "W9B",
  reprints: ["set1-025", "set9-031"],
  set: "009",
  cardNumber: 31,
  rarity: "common",
  externalIds: {
    lorcast: "crd_ecf737e88516492c9592efb0c0b6da85",
    tcgPlayer: 649978,
  },
};
