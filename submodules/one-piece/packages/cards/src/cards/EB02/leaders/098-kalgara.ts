import type { LeaderCard } from "@tcg/op-types";
import { op08Kalgara098 } from "../../OP08/leaders/098-kalgara.ts";
import { eb02Kalgara098I18n } from "./098-kalgara.i18n.ts";

export const eb02Kalgara098: LeaderCard = {
  ...op08Kalgara098,
  id: "OP08-098_ImACvUZ",
  slug: "kalgara/op08-098-imacvuz",
  name: "Kalgara",
  printings: [
    {
      id: "OP08-098_ImACvUZ",
      artId: "OP08-098_ImACvUZ",
      setCode: "EB02",
      collectorNumber: "098",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-098_ImACvUZ.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Kalgara098I18n,
};
