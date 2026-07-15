import type { CharacterCard } from "@tcg/op-types";
import { op04Sugar024 } from "../../OP04/characters/024-sugar.ts";
import { op06SugarSp024I18n } from "./024-sugar-sp.i18n.ts";

export const op06SugarSp024: CharacterCard = {
  ...op04Sugar024,
  id: "OP04-024_p2",
  slug: "sugar-sp",
  name: "Sugar (SP)",
  printings: [
    {
      id: "OP04-024_p2",
      artId: "OP04-024_p2",
      setCode: "OP06",
      collectorNumber: "024",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-024_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06SugarSp024I18n,
};
