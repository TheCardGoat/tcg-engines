import type { CharacterCard } from "@tcg/lorcana-types";
import { yenSidPowerfulSorcerer } from "./059-yen-sid-powerful-sorcerer";

export const yenSidPowerfulSorcererEpic: CharacterCard = {
  ...yenSidPowerfulSorcerer,
  id: "RiX",
  reprints: ["set4-059"],
  set: "004",
  cardNumber: 223,
  rarity: "legendary",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_86d6559da2404639813a26adaa8ccedf",
    tcgPlayer: 544492,
  },
};
