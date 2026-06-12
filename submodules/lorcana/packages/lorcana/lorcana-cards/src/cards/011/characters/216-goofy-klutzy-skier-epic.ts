import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyKlutzySkier } from "./121-goofy-klutzy-skier";

export const goofyKlutzySkierEpic: CharacterCard = {
  ...goofyKlutzySkier,
  id: "Mxa",
  reprints: ["set11-121"],
  set: "011",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_05285db16a3b4cb28941b7a24913d33f",
    tcgPlayer: 677151,
  },
};
