import type { CharacterCard } from "@tcg/op-types";
import { op06Inuarashi100 } from "../../OP06/characters/100-inuarashi.ts";
import { prb01InuarashiJollyRogerFoil100I18n } from "./100-inuarashi-jolly-roger-foil.i18n.ts";

export const prb01InuarashiJollyRogerFoil100: CharacterCard = {
  ...op06Inuarashi100,
  id: "OP06-100_p2",
  slug: "inuarashi-jolly-roger-foil",
  name: "Inuarashi (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-100_p2",
      artId: "OP06-100_p2",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_p2.jpg",
    },
    {
      id: "OP06-100_p3",
      artId: "OP06-100_p3",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_p3.jpg",
    },
    {
      id: "OP06-100_r1",
      artId: "OP06-100_r1",
      setCode: "PRB01",
      collectorNumber: "100",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_p3.jpg",
      imageId: "OP06-100_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_r1.png",
      imageId: "OP06-100_r1",
    },
  ],
  i18n: prb01InuarashiJollyRogerFoil100I18n,
};
