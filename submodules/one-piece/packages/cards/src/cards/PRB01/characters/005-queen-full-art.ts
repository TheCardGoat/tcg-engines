import type { CharacterCard } from "@tcg/op-types";
import { op08QueenSp005 } from "../../OP08/characters/005-queen-sp.ts";
import { prb01QueenFullArt005I18n } from "./005-queen-full-art.i18n.ts";

export const prb01QueenFullArt005: CharacterCard = {
  ...op08QueenSp005,
  id: "ST04-005_p4",
  slug: "queen-full-art",
  name: "Queen (Full Art)",
  printings: [
    {
      id: "ST04-005_p4",
      artId: "ST04-005_p4",
      setCode: "PRB01",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p4.jpg",
    },
    {
      id: "ST04-005_p3",
      artId: "ST04-005_p3",
      setCode: "PRB01",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p3.jpg",
    },
    {
      id: "ST04-005_r1",
      artId: "ST04-005_r1",
      setCode: "PRB01",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p3.jpg",
      imageId: "ST04-005_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_r1.png",
      imageId: "ST04-005_r1",
    },
  ],
  i18n: prb01QueenFullArt005I18n,
};
