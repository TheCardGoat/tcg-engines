import type { CharacterCard } from "@tcg/op-types";
import { op05BeloBetty015 } from "../../OP05/characters/015-belo-betty.ts";
import { prb01BeloBettyJollyRogerFoil015I18n } from "./015-belo-betty-jolly-roger-foil.i18n.ts";

export const prb01BeloBettyJollyRogerFoil015: CharacterCard = {
  ...op05BeloBetty015,
  id: "OP05-015_p3",
  slug: "belo-betty-jolly-roger-foil",
  name: "Belo Betty (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-015_p3",
      artId: "OP05-015_p3",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p3.png",
    },
    {
      id: "OP05-015_r1",
      artId: "OP05-015_r1",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_r1.png",
    },
    {
      id: "OP05-015_p4",
      artId: "OP05-015_p4",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p4.png",
    },
    {
      id: "OP05-015_p5",
      artId: "OP05-015_p5",
      setCode: "PRB01",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p5.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_r1.png",
      imageId: "OP05-015_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p4.png",
      imageId: "OP05-015_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p5.jpg",
      imageId: "OP05-015_p5",
    },
  ],
  i18n: prb01BeloBettyJollyRogerFoil015I18n,
};
