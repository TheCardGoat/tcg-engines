import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletPoohPirateCaptain } from "./016-piglet-pooh-pirate-captain";

export const pigletPoohPirateCaptainEpic: CharacterCard = {
  ...pigletPoohPirateCaptain,
  id: "ZOH",
  reprints: ["set3-016"],
  set: "003",
  cardNumber: 223,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_f478c96f7b1b45b790d74395480da563",
    tcgPlayer: 531822,
  },
};
