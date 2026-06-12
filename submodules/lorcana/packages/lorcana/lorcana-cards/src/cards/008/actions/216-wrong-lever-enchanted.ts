import type { ActionCard } from "@tcg/lorcana-types";
import { wrongLever } from "./116-wrong-lever";

export const wrongLeverEnchanted: ActionCard = {
  ...wrongLever,
  id: "Um9",
  reprints: ["set8-116"],
  set: "008",
  cardNumber: 216,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_a209d31e37bc44e78b2f56cf474bde5d",
    tcgPlayer: 631988,
  },
};
