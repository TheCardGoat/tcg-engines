import type { ActionCard } from "@tcg/lorcana-types";
import { standOut } from "./094-stand-out";

export const standOutEpic: ActionCard = {
  ...standOut,
  id: "Ca2",
  reprints: ["set9-094"],
  set: "009",
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_7b7cb2bd63084cf6942b7174b07be8c0",
    tcgPlayer: 647659,
  },
};
