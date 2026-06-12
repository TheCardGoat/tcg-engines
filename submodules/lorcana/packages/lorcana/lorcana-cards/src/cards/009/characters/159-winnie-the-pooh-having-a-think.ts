import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHavingAThink as canonicalWinnieThePoohHavingAThink } from "../../002";

export const winnieThePoohHavingAThink: CharacterCard = {
  ...canonicalWinnieThePoohHavingAThink,
  id: "YE5",
  reprints: ["set2-161", "set9-159"],
  set: "009",
  cardNumber: 159,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_bf5d82370e8e4900a9e7b05d502470df",
    tcgPlayer: 650094,
  },
};
