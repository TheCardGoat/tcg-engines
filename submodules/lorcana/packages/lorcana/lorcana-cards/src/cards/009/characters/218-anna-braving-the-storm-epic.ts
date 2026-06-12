import type { CharacterCard } from "@tcg/lorcana-types";
import { annaBravingTheStorm } from "../../004";

export const annaBravingTheStormEpic: CharacterCard = {
  ...annaBravingTheStorm,
  id: "pyC",
  reprints: ["set4-137", "set9-146"],
  set: "009",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_d911158c4175449e9814484f3c5adb06",
    tcgPlayer: 650153,
  },
};
