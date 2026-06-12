import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodChampionOfSherwood as canonicalRobinHoodChampionOfSherwood } from "../../003";

export const robinHoodChampionOfSherwood: CharacterCard = {
  ...canonicalRobinHoodChampionOfSherwood,
  id: "Dcv",
  reprints: ["set3-190", "set9-177"],
  set: "009",
  cardNumber: 177,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_2bf47bf7bc7f46afa6d39e40f0dc86e7",
    tcgPlayer: 650110,
  },
};
