import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseGhostHunter } from "./181-minnie-mouse-ghost-hunter";

export const minnieMouseGhostHunterEpic: CharacterCard = {
  ...minnieMouseGhostHunter,
  id: "Cby",
  reprints: ["set10-181"],
  set: "010",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_1ad6e15d73174d7ab0d55b27d770e14d",
    tcgPlayer: 660364,
  },
};
