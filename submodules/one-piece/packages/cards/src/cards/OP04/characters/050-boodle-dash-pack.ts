import type { CharacterCard } from "@tcg/op-types";
import { op03Boodle050 } from "../../OP03/characters/050-boodle.ts";
import { op04BoodleDashPack050I18n } from "./050-boodle-dash-pack.i18n.ts";

export const op04BoodleDashPack050: CharacterCard = {
  ...op03Boodle050,
  id: "OP03-050_OP04",
  slug: "boodle-dash-pack",
  name: "Boodle (Dash Pack)",
  printings: [
    {
      id: "OP03-050_OP04",
      artId: "OP03-050",
      setCode: "OP04",
      collectorNumber: "050",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-050.jpg",
    },
  ],
  rarity: "UC",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04BoodleDashPack050I18n,
};
