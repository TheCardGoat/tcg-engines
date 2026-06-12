import type { ActionCard } from "@tcg/lorcana-types";
import { underTheSea as canonicalUnderTheSea } from "../../004";

export const underTheSea: ActionCard = {
  ...canonicalUnderTheSea,
  id: "uCP",
  reprints: ["set4-095", "set9-097"],
  set: "009",
  cardNumber: 97,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_1d6a3d2a881b42f0a7160c2617e19fea",
    tcgPlayer: 650035,
  },
};
