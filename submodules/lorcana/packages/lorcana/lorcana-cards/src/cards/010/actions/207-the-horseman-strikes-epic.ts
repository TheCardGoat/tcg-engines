import type { ActionCard } from "@tcg/lorcana-types";
import { theHorsemanStrikes } from "./029-the-horseman-strikes";

export const theHorsemanStrikesEpic: ActionCard = {
  ...theHorsemanStrikes,
  id: "Zv7",
  reprints: ["set10-029"],
  set: "010",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_faf17cc51b9748daa7187f81103430d0",
    tcgPlayer: 660013,
  },
};
