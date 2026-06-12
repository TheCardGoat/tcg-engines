import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellGiantFairy as canonicalTinkerBellGiantFairy } from "../../001";

export const tinkerBellGiantFairy: CharacterCard = {
  ...canonicalTinkerBellGiantFairy,
  id: "49g",
  reprints: ["set1-193", "set9-188"],
  set: "009",
  cardNumber: 188,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a77ba07844374c399becfa3d49262642",
    tcgPlayer: 650121,
  },
};
