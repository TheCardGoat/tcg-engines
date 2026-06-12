import type { ActionCard } from "@tcg/lorcana-types";
import { theMobSong as canonicalTheMobSong } from "../../004";

export const theMobSong: ActionCard = {
  ...canonicalTheMobSong,
  id: "B4k",
  reprints: ["set4-198", "set9-202"],
  set: "009",
  cardNumber: 202,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_3145e83418b2482291dc9687d76a4057",
    tcgPlayer: 650134,
  },
};
