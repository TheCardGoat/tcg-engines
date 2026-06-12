import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraRegalPrincess as canonicalAuroraRegalPrincess } from "../../001";

export const auroraRegalPrincess: CharacterCard = {
  ...canonicalAuroraRegalPrincess,
  id: "Pi7",
  reprints: ["set1-140", "set9-161"],
  set: "009",
  cardNumber: 161,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_3935700ef8a04122935f3a9289dfa4af",
    tcgPlayer: 650095,
  },
};
