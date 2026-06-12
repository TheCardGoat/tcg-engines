import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGroundbreakingChef } from "./004-goofy-groundbreaking-chef";

export const goofyGroundbreakingChefEpic: CharacterCard = {
  ...goofyGroundbreakingChef,
  id: "TRK",
  reprints: ["set8-004"],
  set: "008",
  cardNumber: 223,
  rarity: "legendary",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_5271034abc194947b4c2b0e9c66b7f78",
    tcgPlayer: 632719,
  },
};
