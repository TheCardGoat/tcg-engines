import type { CharacterCard } from "@tcg/op-types";
import { prb01QueenFullArt005 } from "../../PRB01/characters/005-queen-full-art.ts";
import { op08QueenSp005I18n } from "./005-queen-sp.i18n.ts";

export const op08QueenSp005: CharacterCard = {
  ...prb01QueenFullArt005,
  id: "ST04-005_p1",
  slug: "queen-sp",
  name: "Queen (SP)",
  printings: [
    {
      id: "ST04-005_p1",
      artId: "ST04-005_p1",
      setCode: "OP08",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p1.jpg",
    },
  ],
  setId: "OP08",
  artVariants: undefined,
  i18n: op08QueenSp005I18n,
};
