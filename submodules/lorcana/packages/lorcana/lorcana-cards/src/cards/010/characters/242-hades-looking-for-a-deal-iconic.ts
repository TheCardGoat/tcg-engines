import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesLookingForADeal } from "./056-hades-looking-for-a-deal";

export const hadesLookingForADealIconic: CharacterCard = {
  ...hadesLookingForADeal,
  id: "R01",
  reprints: ["set10-056"],
  set: "010",
  cardNumber: 242,
  rarity: "common",
  specialRarity: "iconic",
  externalIds: {
    lorcast: "crd_4656262d1cbc478aab92978dc7729663",
    tcgPlayer: 657889,
  },
};
