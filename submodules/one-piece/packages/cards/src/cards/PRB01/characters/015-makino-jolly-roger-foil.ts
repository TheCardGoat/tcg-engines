import type { CharacterCard } from "@tcg/op-types";
import { op02Makino015 } from "../../OP02/characters/015-makino.ts";
import { prb01MakinoJollyRogerFoil015I18n } from "./015-makino-jolly-roger-foil.i18n.ts";

export const prb01MakinoJollyRogerFoil015: CharacterCard = {
  ...op02Makino015,
  id: "OP02-015_p3",
  slug: "makino-jolly-roger-foil",
  name: "Makino (Jolly Roger Foil)",
  printings: [
    {
      id: "OP02-015_p3",
      artId: "OP02-015_p3",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_p3.jpg",
    },
    {
      id: "OP02-015_p4",
      artId: "OP02-015_p4",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_p4.jpg",
    },
    {
      id: "OP02-015_r1",
      artId: "OP02-015_r1",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_p4.jpg",
      imageId: "OP02-015_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_r1.png",
      imageId: "OP02-015_r1",
    },
  ],
  i18n: prb01MakinoJollyRogerFoil015I18n,
};
