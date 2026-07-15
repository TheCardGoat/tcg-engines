import type { CharacterCard } from "@tcg/op-types";
import { op06Arlong023 } from "../../OP06/characters/023-arlong.ts";
import { prb01ArlongJollyRogerFoil023I18n } from "./023-arlong-jolly-roger-foil.i18n.ts";

export const prb01ArlongJollyRogerFoil023: CharacterCard = {
  ...op06Arlong023,
  id: "OP06-023_p2",
  slug: "arlong-jolly-roger-foil",
  name: "Arlong (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-023_p2",
      artId: "OP06-023_p2",
      setCode: "PRB01",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p2.png",
    },
    {
      id: "OP06-023_p3",
      artId: "OP06-023_p3",
      setCode: "PRB01",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p3.jpg",
    },
    {
      id: "OP06-023_r1",
      artId: "OP06-023_r1",
      setCode: "PRB01",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_r1.png",
    },
    {
      id: "OP06-023_p4",
      artId: "OP06-023_p4",
      setCode: "PRB01",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p3.jpg",
      imageId: "OP06-023_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_r1.png",
      imageId: "OP06-023_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p4.jpg",
      imageId: "OP06-023_p4",
    },
  ],
  i18n: prb01ArlongJollyRogerFoil023I18n,
};
