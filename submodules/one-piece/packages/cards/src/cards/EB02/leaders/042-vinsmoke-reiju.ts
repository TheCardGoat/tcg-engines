import type { LeaderCard } from "@tcg/op-types";
import { op06VinsmokeReiju042 } from "../../OP06/leaders/042-vinsmoke-reiju.ts";
import { eb02VinsmokeReiju042I18n } from "./042-vinsmoke-reiju.i18n.ts";

export const eb02VinsmokeReiju042: LeaderCard = {
  ...op06VinsmokeReiju042,
  id: "OP06-042_nOFeCZe",
  slug: "vinsmoke-reiju/op06-042-nofecze",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "OP06-042_nOFeCZe",
      artId: "OP06-042_nOFeCZe",
      setCode: "EB02",
      collectorNumber: "042",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-042_nOFeCZe.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02VinsmokeReiju042I18n,
};
