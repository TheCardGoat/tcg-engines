import type { ActionCard } from "@tcg/lorcana-types";
import { lostInTheWoods as canonicalLostInTheWoods } from "../../004";

export const lostInTheWoods: ActionCard = {
  ...canonicalLostInTheWoods,
  id: "5np",
  reprints: ["set4-029", "set9-028"],
  set: "009",
  cardNumber: 28,
  rarity: "common",
  externalIds: {
    lorcast: "crd_fbdf8cd3fdd840c6b1a52b64d63e2fee",
    tcgPlayer: 649975,
  },
};
