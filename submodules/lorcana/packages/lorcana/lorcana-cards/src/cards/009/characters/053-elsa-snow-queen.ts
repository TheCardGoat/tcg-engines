import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSnowQueen as canonicalElsaSnowQueen } from "../../001";

export const elsaSnowQueen: CharacterCard = {
  ...canonicalElsaSnowQueen,
  id: "pIt",
  reprints: ["set1-041", "set9-053"],
  set: "009",
  cardNumber: 53,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_2b5958e1524648629b663fb210bb7f76",
    tcgPlayer: 647660,
  },
};
