import type { LeaderCard } from "@tcg/op-types";
import { eb01Kyros040 } from "../../EB01/leaders/040-kyros.ts";
import { eb02Kyros040I18n } from "./040-kyros.i18n.ts";

export const eb02Kyros040: LeaderCard = {
  ...eb01Kyros040,
  id: "EB01-040_p2",
  slug: "kyros/eb01-040-p2",
  name: "Kyros",
  printings: [
    {
      id: "EB01-040_p2",
      artId: "EB01-040_p2",
      setCode: "EB02",
      collectorNumber: "040",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-040_p2.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Kyros040I18n,
};
