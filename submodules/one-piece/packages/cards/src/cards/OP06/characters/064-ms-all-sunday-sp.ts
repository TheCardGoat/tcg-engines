import type { CharacterCard } from "@tcg/op-types";
import { op04MsAllSunday064 } from "../../OP04/characters/064-ms-all-sunday.ts";
import { op06MsAllSundaySp064I18n } from "./064-ms-all-sunday-sp.i18n.ts";

export const op06MsAllSundaySp064: CharacterCard = {
  ...op04MsAllSunday064,
  id: "OP04-064_p2",
  slug: "ms-all-sunday-sp",
  name: "Ms. All Sunday (SP)",
  printings: [
    {
      id: "OP04-064_p2",
      artId: "OP04-064_p2",
      setCode: "OP06",
      collectorNumber: "064",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-064_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06MsAllSundaySp064I18n,
};
