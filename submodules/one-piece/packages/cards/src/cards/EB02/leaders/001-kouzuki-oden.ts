import type { LeaderCard } from "@tcg/op-types";
import { eb01KouzukiOden001 } from "../../EB01/leaders/001-kouzuki-oden.ts";
import { eb02KouzukiOden001I18n } from "./001-kouzuki-oden.i18n.ts";

export const eb02KouzukiOden001: LeaderCard = {
  ...eb01KouzukiOden001,
  id: "EB01-001_p2",
  slug: "kouzuki-oden/eb01-001-p2",
  name: "Kouzuki Oden",
  printings: [
    {
      id: "EB01-001_p2",
      artId: "EB01-001_p2",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-001_p2.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02KouzukiOden001I18n,
};
