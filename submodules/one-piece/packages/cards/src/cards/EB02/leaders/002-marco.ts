import type { LeaderCard } from "@tcg/op-types";
import { op08Marco002 } from "../../OP08/leaders/002-marco.ts";
import { eb02Marco002I18n } from "./002-marco.i18n.ts";

export const eb02Marco002: LeaderCard = {
  ...op08Marco002,
  id: "OP08-002_Kf4kRhq",
  slug: "marco/op08-002-kf4krhq",
  name: "Marco",
  printings: [
    {
      id: "OP08-002_Kf4kRhq",
      artId: "OP08-002_Kf4kRhq",
      setCode: "EB02",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-002_Kf4kRhq.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Marco002I18n,
};
