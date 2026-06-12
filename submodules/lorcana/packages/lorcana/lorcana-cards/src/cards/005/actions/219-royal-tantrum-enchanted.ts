import type { ActionCard } from "@tcg/lorcana-types";
import { royalTantrum } from "./161-royal-tantrum";

export const royalTantrumEnchanted: ActionCard = {
  ...royalTantrum,
  id: "VaD",
  reprints: ["set5-161"],
  set: "005",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ae4635bbf7ef4b4fb6a30c61f633fa0d",
    tcgPlayer: 561976,
  },
};
