import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesDivineHero } from "./181-hercules-divine-hero";

export const herculesDivineHeroEnchanted: CharacterCard = {
  ...herculesDivineHero,
  id: "VdL",
  reprints: ["set2-181"],
  set: "002",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_42ef053d7aab445fa7b0a2bf2e028864",
    tcgPlayer: 528113,
  },
};
