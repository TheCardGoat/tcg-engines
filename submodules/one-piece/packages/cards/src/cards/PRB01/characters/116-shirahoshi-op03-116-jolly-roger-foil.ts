import type { CharacterCard } from "@tcg/op-types";
import { op03Shirahoshi116 } from "../../OP03/characters/116-shirahoshi.ts";
import { prb01ShirahoshiOp03116JollyRogerFoil116I18n } from "./116-shirahoshi-op03-116-jolly-roger-foil.i18n.ts";

export const prb01ShirahoshiOp03116JollyRogerFoil116: CharacterCard = {
  ...op03Shirahoshi116,
  id: "OP03-116_p5",
  slug: "shirahoshi-op03-116-jolly-roger-foil",
  name: "Shirahoshi (OP03-116) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-116_p5",
      artId: "OP03-116_p5",
      setCode: "PRB01",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_p5.jpg",
    },
    {
      id: "OP03-116_p6",
      artId: "OP03-116_p6",
      setCode: "PRB01",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_p6.jpg",
    },
    {
      id: "OP03-116_r1",
      artId: "OP03-116_r1",
      setCode: "PRB01",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_p6.jpg",
      imageId: "OP03-116_p6",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_r1.jpg",
      imageId: "OP03-116_r1",
    },
  ],
  i18n: prb01ShirahoshiOp03116JollyRogerFoil116I18n,
};
