import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSnowQueen } from "../../001";

export const elsaSnowQueenEpic: CharacterCard = {
  ...elsaSnowQueen,
  id: "Pk3",
  reprints: ["set1-041", "set9-053"],
  set: "009",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_2b5958e1524648629b663fb210bb7f76",
    tcgPlayer: 647660,
  },
};
