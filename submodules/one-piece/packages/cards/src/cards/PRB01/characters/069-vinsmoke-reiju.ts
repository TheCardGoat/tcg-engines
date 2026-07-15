import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeReiju069 } from "../../OP06/characters/069-vinsmoke-reiju.ts";
import { prb01VinsmokeReiju069I18n } from "./069-vinsmoke-reiju.i18n.ts";

export const prb01VinsmokeReiju069: CharacterCard = {
  ...op06VinsmokeReiju069,
  id: "OP06-069_r1",
  slug: "vinsmoke-reiju/op06-069-r1",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "OP06-069_r1",
      artId: "OP06-069_r1",
      setCode: "PRB01",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-069_r1.png",
    },
    {
      id: "OP06-069_p4",
      artId: "OP06-069_p4",
      setCode: "PRB01",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-069_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-069_p4.jpg",
      imageId: "OP06-069_p4",
    },
  ],
  i18n: prb01VinsmokeReiju069I18n,
};
