import type { CharacterCard } from "@tcg/op-types";
import { op03Izo003 } from "../../OP03/characters/003-izo.ts";
import { prb01IzoOp03003JollyRogerFoil003I18n } from "./003-izo-op03-003-jolly-roger-foil.i18n.ts";

export const prb01IzoOp03003JollyRogerFoil003: CharacterCard = {
  ...op03Izo003,
  id: "OP03-003_p4",
  slug: "izo-op03-003-jolly-roger-foil",
  name: "Izo (OP03-003) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-003_p4",
      artId: "OP03-003_p4",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p4.jpg",
    },
    {
      id: "OP03-003_r2",
      artId: "OP03-003_r2",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_r2.jpg",
    },
    {
      id: "OP03-003_p5",
      artId: "OP03-003_p5",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p5.jpg",
    },
    {
      id: "OP03-003_p6",
      artId: "OP03-003_p6",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p6.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_r2.jpg",
      imageId: "OP03-003_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p5.jpg",
      imageId: "OP03-003_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p6.jpg",
      imageId: "OP03-003_p6",
    },
  ],
  i18n: prb01IzoOp03003JollyRogerFoil003I18n,
};
