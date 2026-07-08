import type { LeaderCard } from "@tcg/op-types";
import { op08King057 } from "../../OP08/leaders/057-king.ts";
import { eb02King057I18n } from "./057-king.i18n.ts";

export const eb02King057: LeaderCard = {
  ...op08King057,
  id: "OP08-057_c2YBDAN",
  slug: "king/op08-057-c2ybdan",
  name: "King",
  printings: [
    {
      id: "OP08-057_c2YBDAN",
      artId: "OP08-057_c2YBDAN",
      setCode: "EB02",
      collectorNumber: "057",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-057_c2YBDAN.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02King057I18n,
};
