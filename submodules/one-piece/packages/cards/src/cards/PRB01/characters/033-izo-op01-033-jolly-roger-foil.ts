import type { CharacterCard } from "@tcg/op-types";
import { op01Izo033 } from "../../OP01/characters/033-izo.ts";
import { prb01IzoOp01033JollyRogerFoil033I18n } from "./033-izo-op01-033-jolly-roger-foil.i18n.ts";

export const prb01IzoOp01033JollyRogerFoil033: CharacterCard = {
  ...op01Izo033,
  id: "OP01-033_p3",
  slug: "izo-op01-033-jolly-roger-foil",
  name: "Izo (OP01-033) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP01-033_p3",
      artId: "OP01-033_p3",
      setCode: "PRB01",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p3.jpg",
    },
    {
      id: "OP01-033_p5",
      artId: "OP01-033_p5",
      setCode: "PRB01",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p5.jpg",
    },
    {
      id: "OP01-033_r1",
      artId: "OP01-033_r1",
      setCode: "PRB01",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p5.jpg",
      imageId: "OP01-033_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_r1.png",
      imageId: "OP01-033_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p5_8AI2ZwU.jpg",
      imageId: "OP01-033_p5",
    },
  ],
  i18n: prb01IzoOp01033JollyRogerFoil033I18n,
};
