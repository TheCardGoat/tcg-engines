import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

export const daisyDuckGhostFinderEpic: CharacterCard = {
  ...daisyDuckGhostFinder,
  id: "Uhy",
  reprints: ["set10-141"],
  set: "010",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_8076e7de5c3a4681b8a91629932092e5",
    tcgPlayer: 660363,
  },
};
