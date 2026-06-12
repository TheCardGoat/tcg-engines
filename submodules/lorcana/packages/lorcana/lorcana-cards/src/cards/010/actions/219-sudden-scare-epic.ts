import type { ActionCard } from "@tcg/lorcana-types";
import { suddenScare } from "./164-sudden-scare";

export const suddenScareEpic: ActionCard = {
  ...suddenScare,
  id: "d49",
  reprints: ["set10-164"],
  set: "010",
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_7101d6f7aaba488e9a508b0d40172743",
    tcgPlayer: 660271,
  },
};
