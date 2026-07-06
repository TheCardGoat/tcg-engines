import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeYonji066 } from "../../OP06/characters/066-vinsmoke-yonji.ts";
import { prb01VinsmokeYonjiOp06066JollyRogerFoil066I18n } from "./066-vinsmoke-yonji-op06-066-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeYonjiOp06066JollyRogerFoil066: CharacterCard = {
  ...op06VinsmokeYonji066,
  id: "OP06-066_p2",
  slug: "vinsmoke-yonji-op06-066-jolly-roger-foil",
  name: "Vinsmoke Yonji (OP06-066) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-066_p2",
      artId: "OP06-066_p2",
      setCode: "PRB01",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-066_p2.jpg",
    },
    {
      id: "OP06-066_p3",
      artId: "OP06-066_p3",
      setCode: "PRB01",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-066_p3.jpg",
    },
    {
      id: "OP06-066_r1",
      artId: "OP06-066_r1",
      setCode: "PRB01",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-066_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-066_p3.jpg",
      imageId: "OP06-066_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-066_r1.png",
      imageId: "OP06-066_r1",
    },
  ],
  i18n: prb01VinsmokeYonjiOp06066JollyRogerFoil066I18n,
};
