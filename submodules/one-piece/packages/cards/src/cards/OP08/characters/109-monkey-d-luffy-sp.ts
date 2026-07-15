import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy109 } from "../../OP07/characters/109-monkey-d-luffy.ts";
import { op08MonkeyDLuffySp109I18n } from "./109-monkey-d-luffy-sp.i18n.ts";

export const op08MonkeyDLuffySp109: CharacterCard = {
  ...op07MonkeyDLuffy109,
  id: "OP07-109_p2",
  slug: "monkey-d-luffy-sp/op07-109",
  name: "Monkey.D.Luffy (SP)",
  printings: [
    {
      id: "OP07-109_p2",
      artId: "OP07-109_p2",
      setCode: "OP08",
      collectorNumber: "109",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-109_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP08",
  artVariants: undefined,
  i18n: op08MonkeyDLuffySp109I18n,
};
