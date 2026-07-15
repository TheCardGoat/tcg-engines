import type { CharacterCard } from "@tcg/op-types";
import { op06EmporioIvankov003 } from "../../OP06/characters/003-emporio-ivankov.ts";
import { prb01EmporioIvankovJollyRogerFoil003I18n } from "./003-emporio-ivankov-jolly-roger-foil.i18n.ts";

export const prb01EmporioIvankovJollyRogerFoil003: CharacterCard = {
  ...op06EmporioIvankov003,
  id: "OP06-003_p2",
  slug: "emporio-ivankov-jolly-roger-foil",
  name: "Emporio.Ivankov (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-003_p2",
      artId: "OP06-003_p2",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_p2.jpg",
    },
    {
      id: "OP06-003_p3",
      artId: "OP06-003_p3",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_p3.jpg",
    },
    {
      id: "OP06-003_r1",
      artId: "OP06-003_r1",
      setCode: "PRB01",
      collectorNumber: "003",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_p3.jpg",
      imageId: "OP06-003_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_r1.png",
      imageId: "OP06-003_r1",
    },
  ],
  i18n: prb01EmporioIvankovJollyRogerFoil003I18n,
};
