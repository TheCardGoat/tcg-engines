import type { ActionCard } from "@tcg/lorcana-types";
import { healWhatHasBeenHurt as canonicalHealWhatHasBeenHurt } from "../../003";

export const healWhatHasBeenHurt: ActionCard = {
  ...canonicalHealWhatHasBeenHurt,
  id: "65f",
  reprints: ["set3-026", "set9-027"],
  set: "009",
  cardNumber: 27,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d3bdbbdbd842435fa3fa0ac7ec4eb28d",
    tcgPlayer: 649974,
  },
};
