import type { ActionCard } from "@tcg/lorcana-types";
import { ragingStorm } from "./028-raging-storm";

export const ragingStormEnchanted: ActionCard = {
  ...ragingStorm,
  id: "BIk",
  reprints: ["set11-028"],
  set: "011",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b3c4b83755bd417bb09f35ffea57cb68",
    tcgPlayer: 677159,
  },
};
