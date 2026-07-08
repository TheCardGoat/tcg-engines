import type { LeaderCard } from "@tcg/op-types";
import { op05Enel098 } from "../../OP05/leaders/098-enel.ts";
import { eb02Enel098I18n } from "./098-enel.i18n.ts";

export const eb02Enel098: LeaderCard = {
  ...op05Enel098,
  id: "OP05-098_H7ASBF6",
  slug: "enel/op05-098-h7asbf6",
  name: "Enel",
  printings: [
    {
      id: "OP05-098_H7ASBF6",
      artId: "OP05-098_H7ASBF6",
      setCode: "EB02",
      collectorNumber: "098",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-098_H7ASBF6.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Enel098I18n,
};
