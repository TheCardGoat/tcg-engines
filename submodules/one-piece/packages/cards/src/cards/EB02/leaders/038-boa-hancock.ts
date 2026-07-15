import type { LeaderCard } from "@tcg/op-types";
import { op07BoaHancock038 } from "../../OP07/leaders/038-boa-hancock.ts";
import { eb02BoaHancock038I18n } from "./038-boa-hancock.i18n.ts";

export const eb02BoaHancock038: LeaderCard = {
  ...op07BoaHancock038,
  id: "OP07-038_BsQgtR0",
  slug: "boa-hancock/op07-038-bsqgtr0",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP07-038_BsQgtR0",
      artId: "OP07-038_BsQgtR0",
      setCode: "EB02",
      collectorNumber: "038",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-038_BsQgtR0.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02BoaHancock038I18n,
};
