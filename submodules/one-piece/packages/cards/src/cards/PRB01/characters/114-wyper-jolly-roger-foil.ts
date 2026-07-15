import type { CharacterCard } from "@tcg/op-types";
import { op06Wyper114 } from "../../OP06/characters/114-wyper.ts";
import { prb01WyperJollyRogerFoil114I18n } from "./114-wyper-jolly-roger-foil.i18n.ts";

export const prb01WyperJollyRogerFoil114: CharacterCard = {
  ...op06Wyper114,
  id: "OP06-114_p2",
  slug: "wyper-jolly-roger-foil",
  name: "Wyper (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-114_p2",
      artId: "OP06-114_p2",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p2.jpg",
    },
    {
      id: "OP06-114_p3",
      artId: "OP06-114_p3",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p3.jpg",
    },
    {
      id: "OP06-114_r1",
      artId: "OP06-114_r1",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_p3.jpg",
      imageId: "OP06-114_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114_r1.png",
      imageId: "OP06-114_r1",
    },
  ],
  i18n: prb01WyperJollyRogerFoil114I18n,
};
