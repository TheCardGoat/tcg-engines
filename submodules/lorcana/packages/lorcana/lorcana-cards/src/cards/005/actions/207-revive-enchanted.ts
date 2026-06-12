import type { ActionCard } from "@tcg/lorcana-types";
import { revive } from "./027-revive";

export const reviveEnchanted: ActionCard = {
  ...revive,
  id: "Q4x",
  reprints: ["set5-027"],
  set: "005",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_d7a644695e604c958aee5d0ba8fa8415",
    tcgPlayer: 561979,
  },
};
