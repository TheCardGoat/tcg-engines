import type { LeaderCard } from "@tcg/op-types";
import { op08Carrot021 } from "../../OP08/leaders/021-carrot.ts";
import { eb02Carrot021I18n } from "./021-carrot.i18n.ts";

export const eb02Carrot021: LeaderCard = {
  ...op08Carrot021,
  id: "OP08-021_bfZmE7y",
  slug: "carrot/op08-021-bfzme7y",
  name: "Carrot",
  printings: [
    {
      id: "OP08-021_bfZmE7y",
      artId: "OP08-021_bfZmE7y",
      setCode: "EB02",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-021_bfZmE7y.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Carrot021I18n,
};
