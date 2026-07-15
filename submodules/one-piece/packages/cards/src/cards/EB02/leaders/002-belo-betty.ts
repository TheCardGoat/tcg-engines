import type { LeaderCard } from "@tcg/op-types";
import { op05BeloBetty002 } from "../../OP05/leaders/002-belo-betty.ts";
import { eb02BeloBetty002I18n } from "./002-belo-betty.i18n.ts";

export const eb02BeloBetty002: LeaderCard = {
  ...op05BeloBetty002,
  id: "OP05-002_nKgWASn",
  slug: "belo-betty/op05-002-nkgwasn",
  name: "Belo Betty",
  printings: [
    {
      id: "OP05-002_nKgWASn",
      artId: "OP05-002_nKgWASn",
      setCode: "EB02",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-002_nKgWASn.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02BeloBetty002I18n,
};
