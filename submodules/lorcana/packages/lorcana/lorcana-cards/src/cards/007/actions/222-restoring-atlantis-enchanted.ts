import type { ActionCard } from "@tcg/lorcana-types";
import { restoringAtlantis } from "./201-restoring-atlantis";

export const restoringAtlantisEnchanted: ActionCard = {
  ...restoringAtlantis,
  id: "GPH",
  reprints: ["set7-201"],
  set: "007",
  cardNumber: 222,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ad5f241dfb68479189af1ac3802327d7",
    tcgPlayer: 619750,
  },
};
