import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrumpeter } from "./182-mickey-mouse-trumpeter";

export const mickeyMouseTrumpeterEnchanted: CharacterCard = {
  ...mickeyMouseTrumpeter,
  id: "mNb",
  reprints: ["set3-182", "set9-172"],
  set: "003",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_631c3f90c74b4c0cabded03d2b07f85b",
    tcgPlayer: 650106,
  },
};
