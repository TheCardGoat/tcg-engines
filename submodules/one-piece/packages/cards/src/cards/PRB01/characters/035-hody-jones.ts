import type { CharacterCard } from "@tcg/op-types";
import { op06HodyJones035 } from "../../OP06/characters/035-hody-jones.ts";
import { prb01HodyJones035I18n } from "./035-hody-jones.i18n.ts";

export const prb01HodyJones035: CharacterCard = {
  ...op06HodyJones035,
  id: "OP06-035_r1",
  slug: "hody-jones/op06-035-r1",
  name: "Hody Jones",
  printings: [
    {
      id: "OP06-035_r1",
      artId: "OP06-035_r1",
      setCode: "PRB01",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_r1.png",
    },
    {
      id: "OP06-035_p3",
      artId: "OP06-035_p3",
      setCode: "PRB01",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_p3.jpg",
      imageId: "OP06-035_p3",
    },
  ],
  i18n: prb01HodyJones035I18n,
};
