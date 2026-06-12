import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckFlusteredSorcerer } from "./073-donald-duck-flustered-sorcerer";

export const donaldDuckFlusteredSorcererEnchanted: CharacterCard = {
  ...donaldDuckFlusteredSorcerer,
  id: "KYT",
  reprints: ["set7-073"],
  set: "007",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ac531a6c2f3046d3adcffbd1b1e5228e",
    tcgPlayer: 619737,
  },
};
