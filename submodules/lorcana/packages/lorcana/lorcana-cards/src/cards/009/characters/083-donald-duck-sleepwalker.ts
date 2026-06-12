import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckSleepwalker as canonicalDonaldDuckSleepwalker } from "../../002";

export const donaldDuckSleepwalker: CharacterCard = {
  ...canonicalDonaldDuckSleepwalker,
  id: "oVH",
  reprints: ["set2-078", "set9-083"],
  set: "009",
  cardNumber: 83,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a93802d7a13a4535acb8c9a6bc31dfc2",
    tcgPlayer: 650023,
  },
};
