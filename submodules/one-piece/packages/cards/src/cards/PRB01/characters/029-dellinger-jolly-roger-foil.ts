import type { CharacterCard } from "@tcg/op-types";
import { op04Dellinger029 } from "../../OP04/characters/029-dellinger.ts";
import { prb01DellingerJollyRogerFoil029I18n } from "./029-dellinger-jolly-roger-foil.i18n.ts";

export const prb01DellingerJollyRogerFoil029: CharacterCard = {
  ...op04Dellinger029,
  id: "OP04-029_p2",
  slug: "dellinger-jolly-roger-foil",
  name: "Dellinger (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-029_p2",
      artId: "OP04-029_p2",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_p2.jpg",
    },
    {
      id: "OP04-029_p3",
      artId: "OP04-029_p3",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_p3.jpg",
    },
    {
      id: "OP04-029_r1",
      artId: "OP04-029_r1",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_p3.jpg",
      imageId: "OP04-029_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_r1.jpg",
      imageId: "OP04-029_r1",
    },
  ],
  i18n: prb01DellingerJollyRogerFoil029I18n,
};
