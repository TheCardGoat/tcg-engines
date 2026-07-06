import type { LeaderCard } from "@tcg/op-types";
import { op07Vegapunk097 } from "../../OP07/leaders/097-vegapunk.ts";
import { eb02Vegapunk097I18n } from "./097-vegapunk.i18n.ts";

export const eb02Vegapunk097: LeaderCard = {
  ...op07Vegapunk097,
  id: "OP07-097_8KRI3qq",
  slug: "vegapunk/op07-097-8kri3qq",
  name: "Vegapunk",
  printings: [
    {
      id: "OP07-097_8KRI3qq",
      artId: "OP07-097_8KRI3qq",
      setCode: "EB02",
      collectorNumber: "097",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-097_8KRI3qq.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Vegapunk097I18n,
};
