import type { ItemCard } from "@tcg/lorcana-types";
import { maleficentsStaff } from "./065-maleficents-staff";

export const maleficentsStaffEnchanted: ItemCard = {
  ...maleficentsStaff,
  id: "09M",
  reprints: ["set6-065"],
  set: "006",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_66c2f5fd704b45bdbe79f585ac31d6fc",
    tcgPlayer: 592034,
  },
};
