import type { ActionCard } from "@tcg/lorcana-types";
import { youCanFly as canonicalYouCanFly } from "../../002";

export const youCanFly: ActionCard = {
  ...canonicalYouCanFly,
  id: "PnR",
  reprints: ["set2-133", "set9-131"],
  set: "009",
  cardNumber: 131,
  rarity: "common",
  externalIds: {
    lorcast: "crd_53b7756b77ee49df8373e45db50bd1de",
    tcgPlayer: 650066,
  },
};
