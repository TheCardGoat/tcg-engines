import type { ActionCard } from "@tcg/lorcana-types";
import { oneJumpAhead as canonicalOneJumpAhead } from "../../001";

export const oneJumpAhead: ActionCard = {
  ...canonicalOneJumpAhead,
  id: "GXc",
  reprints: ["set1-164", "set9-165"],
  set: "009",
  cardNumber: 165,
  rarity: "common",
  externalIds: {
    lorcast: "crd_5bc8b5538ba94d59979d7ebb574c0bd2",
    tcgPlayer: 650099,
  },
};
