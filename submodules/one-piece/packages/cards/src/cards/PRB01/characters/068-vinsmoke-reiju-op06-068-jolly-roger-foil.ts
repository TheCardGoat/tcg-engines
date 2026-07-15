import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeReiju068 } from "../../OP06/characters/068-vinsmoke-reiju.ts";
import { prb01VinsmokeReijuOp06068JollyRogerFoil068I18n } from "./068-vinsmoke-reiju-op06-068-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeReijuOp06068JollyRogerFoil068: CharacterCard = {
  ...op06VinsmokeReiju068,
  id: "OP06-068_p2",
  slug: "vinsmoke-reiju-op06-068-jolly-roger-foil",
  name: "Vinsmoke Reiju (OP06-068) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-068_p2",
      artId: "OP06-068_p2",
      setCode: "PRB01",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-068_p2.jpg",
    },
    {
      id: "OP06-068_p3",
      artId: "OP06-068_p3",
      setCode: "PRB01",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-068_p3.jpg",
    },
    {
      id: "OP06-068_r1",
      artId: "OP06-068_r1",
      setCode: "PRB01",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-068_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-068_p3.jpg",
      imageId: "OP06-068_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-068_r1.png",
      imageId: "OP06-068_r1",
    },
  ],
  i18n: prb01VinsmokeReijuOp06068JollyRogerFoil068I18n,
};
