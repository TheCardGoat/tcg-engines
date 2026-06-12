import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitchQueen } from "./058-ursula-sea-witch-queen";

export const ursulaSeaWitchQueenEnchanted: CharacterCard = {
  ...ursulaSeaWitchQueen,
  id: "NEx",
  reprints: ["set4-058"],
  set: "004",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_68c45595c25041f3bcf2073a5b533edd",
    tcgPlayer: 550844,
  },
};
