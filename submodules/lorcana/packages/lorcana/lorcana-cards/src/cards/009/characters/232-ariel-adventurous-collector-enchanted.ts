import type { CharacterCard } from "@tcg/lorcana-types";
import { arielAdventurousCollector } from "../../003";

export const arielAdventurousCollectorEnchanted: CharacterCard = {
  ...arielAdventurousCollector,
  id: "NxO",
  reprints: ["set3-103", "set9-107"],
  set: "009",
  cardNumber: 232,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_e6a1d03334964fb78033020d86a5f502",
    tcgPlayer: 651123,
  },
};
