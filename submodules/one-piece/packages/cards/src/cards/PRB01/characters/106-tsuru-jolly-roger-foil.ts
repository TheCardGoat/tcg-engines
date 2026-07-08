import type { CharacterCard } from "@tcg/op-types";
import { op02Tsuru106 } from "../../OP02/characters/106-tsuru.ts";
import { prb01TsuruJollyRogerFoil106I18n } from "./106-tsuru-jolly-roger-foil.i18n.ts";

export const prb01TsuruJollyRogerFoil106: CharacterCard = {
  ...op02Tsuru106,
  id: "OP02-106_p4",
  slug: "tsuru-jolly-roger-foil",
  name: "Tsuru (Jolly Roger Foil)",
  printings: [
    {
      id: "OP02-106_p4",
      artId: "OP02-106_p4",
      setCode: "PRB01",
      collectorNumber: "106",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_p4.jpg",
    },
    {
      id: "OP02-106_r2",
      artId: "OP02-106_r2",
      setCode: "PRB01",
      collectorNumber: "106",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_r2.jpg",
    },
    {
      id: "OP02-106_p5",
      artId: "OP02-106_p5",
      setCode: "PRB01",
      collectorNumber: "106",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_p5.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_r2.jpg",
      imageId: "OP02-106_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_p5.jpg",
      imageId: "OP02-106_p5",
    },
  ],
  i18n: prb01TsuruJollyRogerFoil106I18n,
};
