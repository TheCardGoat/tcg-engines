import type { CharacterCard } from "@tcg/op-types";
import { op06VictoriaCindry091 } from "../../OP06/characters/091-victoria-cindry.ts";
import { prb01VictoriaCindryJollyRogerFoil091I18n } from "./091-victoria-cindry-jolly-roger-foil.i18n.ts";

export const prb01VictoriaCindryJollyRogerFoil091: CharacterCard = {
  ...op06VictoriaCindry091,
  id: "OP06-091_p2",
  slug: "victoria-cindry-jolly-roger-foil",
  name: "Victoria Cindry (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-091_p2",
      artId: "OP06-091_p2",
      setCode: "PRB01",
      collectorNumber: "091",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_p2.jpg",
    },
    {
      id: "OP06-091_p3",
      artId: "OP06-091_p3",
      setCode: "PRB01",
      collectorNumber: "091",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_p3.jpg",
    },
    {
      id: "OP06-091_r1",
      artId: "OP06-091_r1",
      setCode: "PRB01",
      collectorNumber: "091",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_p3.jpg",
      imageId: "OP06-091_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_r1.png",
      imageId: "OP06-091_r1",
    },
  ],
  i18n: prb01VictoriaCindryJollyRogerFoil091I18n,
};
