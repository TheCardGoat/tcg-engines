import type { CharacterCard } from "@tcg/lorcana-types";
import { cursedMerfolkUrsulasHandiwork as canonicalCursedMerfolkUrsulasHandiwork } from "../../003";

export const cursedMerfolkUrsulasHandiwork: CharacterCard = {
  ...canonicalCursedMerfolkUrsulasHandiwork,
  id: "38g",
  set: "009",
  cardNumber: 71,
  reprints: ["set3-070", "set9-071"],
  externalIds: {
    lorcast: "crd_c571350ccb314e4aac4f3e79d9a29c87",
    tcgPlayer: 650013,
  },
};
