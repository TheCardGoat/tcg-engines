import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeNiji065 } from "../../OP06/characters/065-vinsmoke-niji.ts";
import { prb01VinsmokeNijiOp06065JollyRogerFoil065I18n } from "./065-vinsmoke-niji-op06-065-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeNijiOp06065JollyRogerFoil065: CharacterCard = {
  ...op06VinsmokeNiji065,
  id: "OP06-065_p2",
  slug: "vinsmoke-niji-op06-065-jolly-roger-foil",
  name: "Vinsmoke Niji (OP06-065) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-065_p2",
      artId: "OP06-065_p2",
      setCode: "PRB01",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p2.jpg",
    },
    {
      id: "OP06-065_p3",
      artId: "OP06-065_p3",
      setCode: "PRB01",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p3.jpg",
    },
    {
      id: "OP06-065_r1",
      artId: "OP06-065_r1",
      setCode: "PRB01",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_r1.png",
    },
    {
      id: "OP06-065_p4",
      artId: "OP06-065_p4",
      setCode: "PRB01",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p3.jpg",
      imageId: "OP06-065_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_r1.png",
      imageId: "OP06-065_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-065_p4.jpg",
      imageId: "OP06-065_p4",
    },
  ],
  i18n: prb01VinsmokeNijiOp06065JollyRogerFoil065I18n,
};
