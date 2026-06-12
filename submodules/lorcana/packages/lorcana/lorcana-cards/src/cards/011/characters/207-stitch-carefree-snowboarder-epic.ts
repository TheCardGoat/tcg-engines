import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSnowboarder } from "./007-stitch-carefree-snowboarder";

export const stitchCarefreeSnowboarderEpic: CharacterCard = {
  ...stitchCarefreeSnowboarder,
  id: "VLK",
  reprints: ["set11-007"],
  set: "011",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_adca393d2367497aac99f2c4dd29b8ce",
  },
};
