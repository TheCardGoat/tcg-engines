import type { ActionCard } from "@tcg/lorcana-types";
import { findersKeepers } from "./060-finders-keepers";

export const findersKeepersEnchanted: ActionCard = {
  ...findersKeepers,
  id: "b01",
  reprints: ["set5-060"],
  set: "005",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_c2ea432892434d9c9814d4bf6c3791a5",
    tcgPlayer: 561997,
  },
};
