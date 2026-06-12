import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelHighClimber } from "./101-rapunzel-high-climber";

export const rapunzelHighClimberEnchanted: CharacterCard = {
  ...rapunzelHighClimber,
  id: "3c0",
  reprints: ["set8-101"],
  set: "008",
  cardNumber: 214,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_cf079ada81bd48cdb9290647f227982c",
    tcgPlayer: 633103,
  },
};
