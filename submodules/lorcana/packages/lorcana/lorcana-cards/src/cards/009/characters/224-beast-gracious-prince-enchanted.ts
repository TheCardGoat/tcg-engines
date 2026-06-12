import type { CharacterCard } from "@tcg/lorcana-types";
import { beastGraciousPrince } from "./004-beast-gracious-prince";

export const beastGraciousPrinceEnchanted: CharacterCard = {
  ...beastGraciousPrince,
  id: "f7n",
  reprints: ["set9-004"],
  set: "009",
  cardNumber: 224,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_8016f590ebb344a2934d76f614fedbba",
    tcgPlayer: 651122,
  },
};
