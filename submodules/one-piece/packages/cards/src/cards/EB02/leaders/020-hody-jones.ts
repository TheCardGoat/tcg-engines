import type { LeaderCard } from "@tcg/op-types";
import { op06HodyJones020 } from "../../OP06/leaders/020-hody-jones.ts";
import { eb02HodyJones020I18n } from "./020-hody-jones.i18n.ts";

export const eb02HodyJones020: LeaderCard = {
  ...op06HodyJones020,
  id: "OP06-020_4ite5RZ",
  slug: "hody-jones/op06-020-4ite5rz",
  name: "Hody Jones",
  printings: [
    {
      id: "OP06-020_4ite5RZ",
      artId: "OP06-020_4ite5RZ",
      setCode: "EB02",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-020_4ite5RZ.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02HodyJones020I18n,
};
