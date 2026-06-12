import type { ActionCard } from "@tcg/lorcana-types";
import { spookySight } from "./165-spooky-sight";

export const spookySightEnchanted: ActionCard = {
  ...spookySight,
  id: "xZ2",
  reprints: ["set10-165"],
  set: "010",
  cardNumber: 237,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_9a1fff8a9426484ebc7fae9cb8605572",
    tcgPlayer: 660011,
  },
};
