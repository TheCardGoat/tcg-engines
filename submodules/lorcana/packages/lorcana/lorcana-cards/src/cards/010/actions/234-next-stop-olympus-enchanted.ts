import type { ActionCard } from "@tcg/lorcana-types";
import { nextStopOlympus } from "./129-next-stop-olympus";

export const nextStopOlympusEnchanted: ActionCard = {
  ...nextStopOlympus,
  id: "K04",
  reprints: ["set10-129"],
  set: "010",
  cardNumber: 234,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_fe0bc499ead74e4f8a5d2b0e6037cf91",
    tcgPlayer: 660028,
  },
};
