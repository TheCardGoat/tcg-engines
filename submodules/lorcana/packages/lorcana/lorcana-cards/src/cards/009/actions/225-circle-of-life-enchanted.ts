import type { ActionCard } from "@tcg/lorcana-types";
import { circleOfLife } from "./026-circle-of-life";

export const circleOfLifeEnchanted: ActionCard = {
  ...circleOfLife,
  id: "pVb",
  reprints: ["set9-026"],
  set: "009",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ee377c93c09341fe808b8582cbded0f2",
    tcgPlayer: 649230,
  },
};
