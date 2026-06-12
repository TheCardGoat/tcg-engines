import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiPersistentPresence as canonicalHeiheiPersistentPresence } from "../../002";

export const heiheiPersistentPresence: CharacterCard = {
  ...canonicalHeiheiPersistentPresence,
  id: "AzV",
  reprints: ["set2-043", "set11-058"],
  set: "011",
  cardNumber: 58,
  rarity: "common",
  externalIds: {
    lorcast: "crd_122d3f9ccb034f7d9e59245d311a7004",
    tcgPlayer: 675296,
  },
};
