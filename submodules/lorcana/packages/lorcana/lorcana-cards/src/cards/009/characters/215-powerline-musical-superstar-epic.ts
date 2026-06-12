import type { CharacterCard } from "@tcg/lorcana-types";
import { powerlineMusicalSuperstar } from "./117-powerline-musical-superstar";

export const powerlineMusicalSuperstarEpic: CharacterCard = {
  ...powerlineMusicalSuperstar,
  id: "eva",
  reprints: ["set9-117"],
  set: "009",
  cardNumber: 215,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_e234293cec8f422eb1d613594771e5ee",
    tcgPlayer: 650151,
  },
};
