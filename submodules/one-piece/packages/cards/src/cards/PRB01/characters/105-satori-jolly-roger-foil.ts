import type { CharacterCard } from "@tcg/op-types";
import { op05Satori105 } from "../../OP05/characters/105-satori.ts";
import { prb01SatoriJollyRogerFoil105I18n } from "./105-satori-jolly-roger-foil.i18n.ts";

export const prb01SatoriJollyRogerFoil105: CharacterCard = {
  ...op05Satori105,
  id: "OP05-105_p2",
  slug: "satori-jolly-roger-foil",
  name: "Satori (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-105_p2",
      artId: "OP05-105_p2",
      setCode: "PRB01",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p2.jpg",
    },
    {
      id: "OP05-105_r1",
      artId: "OP05-105_r1",
      setCode: "PRB01",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_r1.jpg",
    },
    {
      id: "OP05-105_p3",
      artId: "OP05-105_p3",
      setCode: "PRB01",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p3.jpg",
    },
    {
      id: "OP05-105_p4",
      artId: "OP05-105_p4",
      setCode: "PRB01",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_r1.jpg",
      imageId: "OP05-105_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p3.jpg",
      imageId: "OP05-105_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-105_p4.jpg",
      imageId: "OP05-105_p4",
    },
  ],
  i18n: prb01SatoriJollyRogerFoil105I18n,
};
