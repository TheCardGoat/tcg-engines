import type { ActionCard } from "@tcg/lorcana-types";
import { desperatePlan } from "./201-desperate-plan";

export const desperatePlanEnchanted: ActionCard = {
  ...desperatePlan,
  id: "WBL",
  reprints: ["set8-201"],
  set: "008",
  cardNumber: 222,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_cfbcf752b5064d1e8abfc2a2c6d3e98a",
    tcgPlayer: 631990,
  },
};
