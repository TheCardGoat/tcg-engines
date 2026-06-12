import type { CharacterCard } from "@tcg/lorcana-types";
import { kaaSecretiveSnake } from "./079-kaa-secretive-snake";

export const kaaSecretiveSnakeEpic: CharacterCard = {
  ...kaaSecretiveSnake,
  id: "7c9",
  reprints: ["set10-079"],
  set: "010",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_f2d99b79354c466ebcaaeadcba69678e",
    tcgPlayer: 660191,
  },
};
