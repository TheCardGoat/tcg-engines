import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHungryBear } from "./151-winnie-the-pooh-hungry-bear";

export const winnieThePoohHungryBearEpic: CharacterCard = {
  ...winnieThePoohHungryBear,
  id: "Lp1",
  reprints: ["set11-151"],
  set: "011",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_5da5944a7e9240aab2d30466337643c3",
    tcgPlayer: 677152,
  },
};
