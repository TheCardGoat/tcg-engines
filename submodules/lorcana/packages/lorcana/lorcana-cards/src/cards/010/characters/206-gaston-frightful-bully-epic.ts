import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonFrightfulBully } from "./002-gaston-frightful-bully";

export const gastonFrightfulBullyEpic: CharacterCard = {
  ...gastonFrightfulBully,
  id: "5Hn",
  reprints: ["set10-002"],
  set: "010",
  cardNumber: 206,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_22fb811c179742f6b17bead54e0d68f2",
    tcgPlayer: 657888,
  },
};
