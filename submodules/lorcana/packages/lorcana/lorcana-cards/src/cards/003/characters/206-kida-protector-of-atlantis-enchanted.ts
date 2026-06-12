import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaProtectorOfAtlantis } from "./007-kida-protector-of-atlantis";

export const kidaProtectorOfAtlantisEnchanted: CharacterCard = {
  ...kidaProtectorOfAtlantis,
  id: "8Ix",
  reprints: ["set3-007"],
  set: "003",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ae42b2ab4e074f3e91c29d4ba2c3e601",
    tcgPlayer: 539273,
  },
};
