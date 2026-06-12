import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGhostHunter } from "./021-goofy-ghost-hunter";

export const goofyGhostHunterEpic: CharacterCard = {
  ...goofyGhostHunter,
  id: "65t",
  reprints: ["set10-021"],
  set: "010",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_6283ca50c61544b7a6226fadbc7f0a17",
    tcgPlayer: 660359,
  },
};
