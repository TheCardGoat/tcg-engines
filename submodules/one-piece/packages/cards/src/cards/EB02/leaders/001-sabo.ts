import type { LeaderCard } from "@tcg/op-types";
import { op05Sabo001 } from "../../OP05/leaders/001-sabo.ts";
import { eb02Sabo001I18n } from "./001-sabo.i18n.ts";

export const eb02Sabo001: LeaderCard = {
  ...op05Sabo001,
  id: "OP05-001_aimdTZC",
  slug: "sabo/op05-001-aimdtzc",
  name: "Sabo",
  printings: [
    {
      id: "OP05-001_aimdTZC",
      artId: "OP05-001_aimdTZC",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-001_aimdTZC.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Sabo001I18n,
};
