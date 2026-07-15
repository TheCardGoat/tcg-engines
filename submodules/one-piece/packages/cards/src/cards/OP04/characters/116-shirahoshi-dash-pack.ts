import type { CharacterCard } from "@tcg/op-types";
import { op03Shirahoshi116 } from "../../OP03/characters/116-shirahoshi.ts";
import { op04ShirahoshiDashPack116I18n } from "./116-shirahoshi-dash-pack.i18n.ts";

export const op04ShirahoshiDashPack116: CharacterCard = {
  ...op03Shirahoshi116,
  id: "OP03-116_VrV0c8h",
  slug: "shirahoshi-dash-pack",
  name: "Shirahoshi (Dash Pack)",
  printings: [
    {
      id: "OP03-116_VrV0c8h",
      artId: "OP03-116_VrV0c8h",
      setCode: "OP04",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_VrV0c8h.jpg",
    },
  ],
  rarity: "UC",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04ShirahoshiDashPack116I18n,
};
