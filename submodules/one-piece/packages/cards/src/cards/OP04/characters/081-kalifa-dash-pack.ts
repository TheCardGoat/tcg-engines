import type { CharacterCard } from "@tcg/op-types";
import { op03Kalifa081 } from "../../OP03/characters/081-kalifa.ts";
import { op04KalifaDashPack081I18n } from "./081-kalifa-dash-pack.i18n.ts";

export const op04KalifaDashPack081: CharacterCard = {
  ...op03Kalifa081,
  id: "OP03-081_OP04",
  slug: "kalifa-dash-pack",
  name: "Kalifa (Dash Pack)",
  printings: [
    {
      id: "OP03-081_OP04",
      artId: "OP03-081",
      setCode: "OP04",
      collectorNumber: "081",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-081.jpg",
    },
  ],
  rarity: "R",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04KalifaDashPack081I18n,
};
