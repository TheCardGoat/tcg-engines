import type { CharacterCard } from "@tcg/lorcana-types";
import { goofySetForAdventure } from "./074-goofy-set-for-adventure";

export const goofySetForAdventureEpic: CharacterCard = {
  ...goofySetForAdventure,
  id: "Hjw",
  reprints: ["set9-074"],
  set: "009",
  cardNumber: 211,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_bc96b5e1045e45a38da57c302c634ba2",
    tcgPlayer: 650147,
  },
};
