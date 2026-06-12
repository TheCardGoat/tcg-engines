import type { ActionCard } from "@tcg/lorcana-types";
import { oneLastHope } from "../../004";

export const oneLastHopeEpic: ActionCard = {
  ...oneLastHope,
  id: "8tA",
  reprints: ["set4-197", "set9-197"],
  set: "009",
  cardNumber: 222,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_ae1714b13cbc42a4a83ec36fee365526",
    tcgPlayer: 650157,
  },
};
