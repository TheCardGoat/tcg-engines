import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceMaker } from "./069-elsa-ice-maker";

export const elsaIceMakerEpic: CharacterCard = {
  ...elsaIceMaker,
  id: "2hI",
  reprints: ["set7-069"],
  set: "007",
  cardNumber: 224,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_01c4835a62df4960bb973aeff81f2bb2",
    tcgPlayer: 618356,
  },
};
