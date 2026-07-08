import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeIchiji060 } from "../../OP06/characters/060-vinsmoke-ichiji.ts";
import { prb01VinsmokeIchijiOp06060JollyRogerFoil060I18n } from "./060-vinsmoke-ichiji-op06-060-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeIchijiOp06060JollyRogerFoil060: CharacterCard = {
  ...op06VinsmokeIchiji060,
  id: "OP06-060_p2",
  slug: "vinsmoke-ichiji-op06-060-jolly-roger-foil",
  name: "Vinsmoke Ichiji (OP06-060) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-060_p2",
      artId: "OP06-060_p2",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_p2.jpg",
    },
    {
      id: "OP06-060_p3",
      artId: "OP06-060_p3",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_p3.jpg",
    },
    {
      id: "OP06-060_r1",
      artId: "OP06-060_r1",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_p3.jpg",
      imageId: "OP06-060_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-060_r1.png",
      imageId: "OP06-060_r1",
    },
  ],
  i18n: prb01VinsmokeIchijiOp06060JollyRogerFoil060I18n,
};
