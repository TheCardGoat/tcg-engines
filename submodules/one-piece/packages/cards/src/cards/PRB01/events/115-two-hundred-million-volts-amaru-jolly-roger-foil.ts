import type { EventCard } from "@tcg/op-types";
import { op05TwoHundredMillionVoltsAmaru115 } from "../../OP05/events/115-two-hundred-million-volts-amaru.ts";
import { prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115I18n } from "./115-two-hundred-million-volts-amaru-jolly-roger-foil.i18n.ts";

export const prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115: EventCard = {
  ...op05TwoHundredMillionVoltsAmaru115,
  id: "OP05-115_p2",
  slug: "two-hundred-million-volts-amaru-jolly-roger-foil",
  name: "Two-Hundred Million Volts Amaru (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-115_p2",
      artId: "OP05-115_p2",
      setCode: "PRB01",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p2.jpg",
    },
    {
      id: "OP05-115_p3",
      artId: "OP05-115_p3",
      setCode: "PRB01",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p3.jpg",
    },
    {
      id: "OP05-115_r1",
      artId: "OP05-115_r1",
      setCode: "PRB01",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_r1.png",
    },
    {
      id: "OP05-115_p4",
      artId: "OP05-115_p4",
      setCode: "PRB01",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p3.jpg",
      imageId: "OP05-115_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_r1.png",
      imageId: "OP05-115_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p4.jpg",
      imageId: "OP05-115_p4",
    },
  ],
  i18n: prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115I18n,
};
