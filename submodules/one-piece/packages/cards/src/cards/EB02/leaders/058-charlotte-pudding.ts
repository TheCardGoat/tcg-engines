import type { LeaderCard } from "@tcg/op-types";
import { op08CharlottePudding058 } from "../../OP08/leaders/058-charlotte-pudding.ts";
import { eb02CharlottePudding058I18n } from "./058-charlotte-pudding.i18n.ts";

export const eb02CharlottePudding058: LeaderCard = {
  ...op08CharlottePudding058,
  id: "OP08-058_ebjAGog",
  slug: "charlotte-pudding/op08-058-ebjagog",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP08-058_ebjAGog",
      artId: "OP08-058_ebjAGog",
      setCode: "EB02",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-058_ebjAGog.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02CharlottePudding058I18n,
};
