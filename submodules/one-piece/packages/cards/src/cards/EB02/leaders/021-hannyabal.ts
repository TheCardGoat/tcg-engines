import type { LeaderCard } from "@tcg/op-types";
import { eb01Hannyabal021 } from "../../EB01/leaders/021-hannyabal.ts";
import { eb02Hannyabal021I18n } from "./021-hannyabal.i18n.ts";

export const eb02Hannyabal021: LeaderCard = {
  ...eb01Hannyabal021,
  id: "EB01-021_p2",
  slug: "hannyabal/eb01-021-p2",
  name: "Hannyabal",
  printings: [
    {
      id: "EB01-021_p2",
      artId: "EB01-021_p2",
      setCode: "EB02",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-021_p2.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Hannyabal021I18n,
};
