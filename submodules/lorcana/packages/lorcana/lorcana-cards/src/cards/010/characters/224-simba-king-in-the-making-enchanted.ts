import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaKingInTheMaking } from "./020-simba-king-in-the-making";

export const simbaKingInTheMakingEnchanted: CharacterCard = {
  ...simbaKingInTheMaking,
  id: "1Ed",
  reprints: ["set10-020"],
  set: "010",
  cardNumber: 224,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_54bfc0bd37f44871a4ef50193d58ca2c",
    tcgPlayer: 658449,
  },
};
