import type { CharacterCard } from "@tcg/op-types";
import { op03MonkeyDLuffy070 } from "../../OP03/characters/070-monkey-d-luffy.ts";
import { op04MonkeyDLuffyDashPack070I18n } from "./070-monkey-d-luffy-dash-pack.i18n.ts";

export const op04MonkeyDLuffyDashPack070: CharacterCard = {
  ...op03MonkeyDLuffy070,
  id: "OP03-070_OP04",
  slug: "monkey-d-luffy-dash-pack",
  name: "Monkey.D.Luffy (Dash Pack)",
  printings: [
    {
      id: "OP03-070_OP04",
      artId: "OP03-070",
      setCode: "OP04",
      collectorNumber: "070",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-070.jpg",
    },
  ],
  rarity: "R",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04MonkeyDLuffyDashPack070I18n,
};
