import type { EventCard } from "@tcg/op-types";
import { op03ThreeThousandWorlds057 } from "../../OP03/events/057-three-thousand-worlds.ts";
import { prb01ThreeThousandWorldsJollyRogerFoil057I18n } from "./057-three-thousand-worlds-jolly-roger-foil.i18n.ts";

export const prb01ThreeThousandWorldsJollyRogerFoil057: EventCard = {
  ...op03ThreeThousandWorlds057,
  id: "OP03-057_p2",
  slug: "three-thousand-worlds-jolly-roger-foil",
  name: "Three Thousand Worlds (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-057_p2",
      artId: "OP03-057_p2",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p2.jpg",
    },
    {
      id: "OP03-057_p3",
      artId: "OP03-057_p3",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p3.jpg",
    },
    {
      id: "OP03-057_r1",
      artId: "OP03-057_r1",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_r1.png",
    },
    {
      id: "OP03-057_p4",
      artId: "OP03-057_p4",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p3.jpg",
      imageId: "OP03-057_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_r1.png",
      imageId: "OP03-057_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p4.jpg",
      imageId: "OP03-057_p4",
    },
  ],
  i18n: prb01ThreeThousandWorldsJollyRogerFoil057I18n,
};
