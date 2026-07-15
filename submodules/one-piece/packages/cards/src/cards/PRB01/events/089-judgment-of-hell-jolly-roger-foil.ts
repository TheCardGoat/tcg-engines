import type { EventCard } from "@tcg/op-types";
import { op02JudgmentOfHell089 } from "../../OP02/events/089-judgment-of-hell.ts";
import { prb01JudgmentOfHellJollyRogerFoil089I18n } from "./089-judgment-of-hell-jolly-roger-foil.i18n.ts";

export const prb01JudgmentOfHellJollyRogerFoil089: EventCard = {
  ...op02JudgmentOfHell089,
  id: "OP02-089_p2",
  slug: "judgment-of-hell-jolly-roger-foil",
  name: "Judgment of Hell (Jolly Roger Foil)",
  printings: [
    {
      id: "OP02-089_p2",
      artId: "OP02-089_p2",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p2.jpg",
    },
    {
      id: "OP02-089_p3",
      artId: "OP02-089_p3",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p3.jpg",
    },
    {
      id: "OP02-089_r1",
      artId: "OP02-089_r1",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_r1.png",
    },
    {
      id: "OP02-089_p4",
      artId: "OP02-089_p4",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p3.jpg",
      imageId: "OP02-089_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_r1.png",
      imageId: "OP02-089_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p4.jpg",
      imageId: "OP02-089_p4",
    },
  ],
  i18n: prb01JudgmentOfHellJollyRogerFoil089I18n,
};
