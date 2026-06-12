import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckSecretAgent as canonicalDaisyDuckSecretAgent } from "../../002";

export const daisyDuckSecretAgent: CharacterCard = {
  ...canonicalDaisyDuckSecretAgent,
  id: "TtR",
  reprints: ["set2-076", "set9-093"],
  set: "009",
  cardNumber: 93,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_2da1b21d6bdc4b29b5e04bacfa14eded",
    tcgPlayer: 650032,
  },
};
