import type { EventCard } from "@tcg/op-types";
import { op03GumGumGiantGavel055 } from "../../OP03/events/055-gum-gum-giant-gavel.ts";
import { prb01GumGumGiantGavelJollyRogerFoil055I18n } from "./055-gum-gum-giant-gavel-jolly-roger-foil.i18n.ts";

export const prb01GumGumGiantGavelJollyRogerFoil055: EventCard = {
  ...op03GumGumGiantGavel055,
  id: "OP03-055_p2",
  slug: "gum-gum-giant-gavel-jolly-roger-foil",
  name: "Gum-Gum Giant Gavel (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-055_p2",
      artId: "OP03-055_p2",
      setCode: "PRB01",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055_p2.jpg",
    },
    {
      id: "OP03-055_p3",
      artId: "OP03-055_p3",
      setCode: "PRB01",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055_p3.jpg",
    },
    {
      id: "OP03-055_r1",
      artId: "OP03-055_r1",
      setCode: "PRB01",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055_p3.jpg",
      imageId: "OP03-055_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055_r1.png",
      imageId: "OP03-055_r1",
    },
  ],
  i18n: prb01GumGumGiantGavelJollyRogerFoil055I18n,
};
