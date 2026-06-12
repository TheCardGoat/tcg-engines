import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoTemperamentalEmperor as canonicalKuzcoTemperamentalEmperor } from "../../001";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  ...canonicalKuzcoTemperamentalEmperor,
  id: "0lp",
  reprints: ["set1-084", "set9-069"],
  set: "009",
  cardNumber: 69,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_758f6165053247138a43133356718b77",
    tcgPlayer: 650011,
  },
};
