import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanFreeSpirit as canonicalMulanFreeSpirit } from "../../002";

export const mulanFreeSpirit: CharacterCard = {
  ...canonicalMulanFreeSpirit,
  id: "E5z",
  reprints: ["set2-015", "set9-010"],
  set: "009",
  cardNumber: 10,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a931864a0b0e42c7852e9609ea84914f",
    tcgPlayer: 649959,
  },
};
