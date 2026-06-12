import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiHeroToAll } from "./114-maui-hero-to-all";

export const mauiHeroToAllEnchanted: CharacterCard = {
  ...mauiHeroToAll,
  id: "9q7",
  reprints: ["set1-114"],
  set: "001",
  cardNumber: 212,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_f839f8a7cb9a47ae962503f3ea69bec5",
    tcgPlayer: 510158,
  },
};
