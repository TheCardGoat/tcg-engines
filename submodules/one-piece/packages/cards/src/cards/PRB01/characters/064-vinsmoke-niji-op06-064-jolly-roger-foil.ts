import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeNiji064 } from "../../OP06/characters/064-vinsmoke-niji.ts";
import { prb01VinsmokeNijiOp06064JollyRogerFoil064I18n } from "./064-vinsmoke-niji-op06-064-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeNijiOp06064JollyRogerFoil064: CharacterCard = {
  ...op06VinsmokeNiji064,
  id: "OP06-064_p2",
  slug: "vinsmoke-niji-op06-064-jolly-roger-foil",
  name: "Vinsmoke Niji (OP06-064) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-064_p2",
      artId: "OP06-064_p2",
      setCode: "PRB01",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_p2.jpg",
    },
    {
      id: "OP06-064_p3",
      artId: "OP06-064_p3",
      setCode: "PRB01",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_p3.jpg",
    },
    {
      id: "OP06-064_r1",
      artId: "OP06-064_r1",
      setCode: "PRB01",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_p3.jpg",
      imageId: "OP06-064_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064_r1.png",
      imageId: "OP06-064_r1",
    },
  ],
  i18n: prb01VinsmokeNijiOp06064JollyRogerFoil064I18n,
};
