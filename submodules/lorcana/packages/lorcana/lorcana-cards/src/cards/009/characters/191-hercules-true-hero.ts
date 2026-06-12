import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesTrueHero as canonicalHerculesTrueHero } from "../../001";

export const herculesTrueHero: CharacterCard = {
  ...canonicalHerculesTrueHero,
  id: "xYw",
  reprints: ["set1-181", "set9-191"],
  set: "009",
  cardNumber: 191,
  rarity: "common",
  externalIds: {
    lorcast: "crd_2ae8a63bba494c3e842e54ec56da3021",
    tcgPlayer: 650124,
  },
};
