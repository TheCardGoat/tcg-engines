import type { CharacterCard } from "@tcg/lorcana-types";
import { maidMarianDelightfulDreamer as canonicalMaidMarianDelightfulDreamer } from "../../003";

export const maidMarianDelightfulDreamer: CharacterCard = {
  ...canonicalMaidMarianDelightfulDreamer,
  id: "nXb",
  reprints: ["set3-150", "set9-158"],
  set: "009",
  cardNumber: 158,
  rarity: "common",
  externalIds: {
    lorcast: "crd_73c0d376411b4b588a9de5cc5644e4bb",
    tcgPlayer: 650093,
  },
};
