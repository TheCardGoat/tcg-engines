import type { CharacterCard } from "@tcg/lorcana-types";
import { arielAdventurousCollector as canonicalArielAdventurousCollector } from "../../003";

export const arielAdventurousCollector: CharacterCard = {
  ...canonicalArielAdventurousCollector,
  id: "Wwm",
  reprints: ["set3-103", "set9-107"],
  set: "009",
  cardNumber: 107,
  rarity: "common",
  externalIds: {
    lorcast: "crd_e6a1d03334964fb78033020d86a5f502",
    tcgPlayer: 651123,
  },
};
