import type { EventCard } from "@tcg/op-types";
import { op02IceAge117 } from "../../OP02/events/117-ice-age.ts";
import { prb01IceAgeTexturedFoil117I18n } from "./117-ice-age-textured-foil.i18n.ts";

export const prb01IceAgeTexturedFoil117: EventCard = {
  ...op02IceAge117,
  id: "OP02-117_p6",
  slug: "ice-age-textured-foil",
  name: "Ice Age (Textured Foil)",
  printings: [
    {
      id: "OP02-117_p6",
      artId: "OP02-117_p6",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p6.jpg",
    },
    {
      id: "OP02-117_p5",
      artId: "OP02-117_p5",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p5.jpg",
    },
    {
      id: "OP02-117_r2",
      artId: "OP02-117_r2",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_r2.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p5.jpg",
      imageId: "OP02-117_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_r2.png",
      imageId: "OP02-117_r2",
    },
  ],
  i18n: prb01IceAgeTexturedFoil117I18n,
};
