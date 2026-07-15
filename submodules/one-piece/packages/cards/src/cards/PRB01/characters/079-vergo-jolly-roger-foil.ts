import type { CharacterCard } from "@tcg/op-types";
import { op03Vergo079 } from "../../OP03/characters/079-vergo.ts";
import { prb01VergoJollyRogerFoil079I18n } from "./079-vergo-jolly-roger-foil.i18n.ts";

export const prb01VergoJollyRogerFoil079: CharacterCard = {
  ...op03Vergo079,
  id: "OP03-079_p3",
  slug: "vergo-jolly-roger-foil",
  name: "Vergo (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-079_p3",
      artId: "OP03-079_p3",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_p3.jpg",
    },
    {
      id: "OP03-079_p4",
      artId: "OP03-079_p4",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_p4.jpg",
    },
    {
      id: "OP03-079_r2",
      artId: "OP03-079_r2",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_r2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_p4.jpg",
      imageId: "OP03-079_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_r2.jpg",
      imageId: "OP03-079_r2",
    },
  ],
  i18n: prb01VergoJollyRogerFoil079I18n,
};
