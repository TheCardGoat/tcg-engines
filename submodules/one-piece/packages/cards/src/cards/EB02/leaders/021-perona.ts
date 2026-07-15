import type { LeaderCard } from "@tcg/op-types";
import { op06Perona021 } from "../../OP06/leaders/021-perona.ts";
import { eb02Perona021I18n } from "./021-perona.i18n.ts";

export const eb02Perona021: LeaderCard = {
  ...op06Perona021,
  id: "OP06-021_PsM3gfh",
  slug: "perona/op06-021-psm3gfh",
  name: "Perona",
  printings: [
    {
      id: "OP06-021_PsM3gfh",
      artId: "OP06-021_PsM3gfh",
      setCode: "EB02",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-021_PsM3gfh.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Perona021I18n,
};
