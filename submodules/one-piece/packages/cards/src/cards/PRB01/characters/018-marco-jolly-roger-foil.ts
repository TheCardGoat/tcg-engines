import type { CharacterCard } from "@tcg/op-types";
import { op02Marco018 } from "../../OP02/characters/018-marco.ts";
import { prb01MarcoJollyRogerFoil018I18n } from "./018-marco-jolly-roger-foil.i18n.ts";

export const prb01MarcoJollyRogerFoil018: CharacterCard = {
  ...op02Marco018,
  id: "OP02-018_p4",
  slug: "marco-jolly-roger-foil",
  name: "Marco (Jolly Roger Foil)",
  printings: [
    {
      id: "OP02-018_p4",
      artId: "OP02-018_p4",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p4.jpg",
    },
    {
      id: "OP02-018_r2",
      artId: "OP02-018_r2",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_r2.jpg",
    },
    {
      id: "OP02-018_p5",
      artId: "OP02-018_p5",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p5.jpg",
    },
    {
      id: "OP02-018_p6",
      artId: "OP02-018_p6",
      setCode: "PRB01",
      collectorNumber: "018",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p6.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_r2.jpg",
      imageId: "OP02-018_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p5.jpg",
      imageId: "OP02-018_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p6.jpg",
      imageId: "OP02-018_p6",
    },
  ],
  i18n: prb01MarcoJollyRogerFoil018I18n,
};
