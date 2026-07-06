import type { CharacterCard } from "@tcg/op-types";
import { op06Nekomamushi110 } from "../../OP06/characters/110-nekomamushi.ts";
import { prb01NekomamushiJollyRogerFoil110I18n } from "./110-nekomamushi-jolly-roger-foil.i18n.ts";

export const prb01NekomamushiJollyRogerFoil110: CharacterCard = {
  ...op06Nekomamushi110,
  id: "OP06-110_p3",
  slug: "nekomamushi-jolly-roger-foil",
  name: "Nekomamushi (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-110_p3",
      artId: "OP06-110_p3",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_p3.jpg",
    },
    {
      id: "OP06-110_p4",
      artId: "OP06-110_p4",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_p4.jpg",
    },
    {
      id: "OP06-110_r1",
      artId: "OP06-110_r1",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_p4.jpg",
      imageId: "OP06-110_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_r1.png",
      imageId: "OP06-110_r1",
    },
  ],
  i18n: prb01NekomamushiJollyRogerFoil110I18n,
};
