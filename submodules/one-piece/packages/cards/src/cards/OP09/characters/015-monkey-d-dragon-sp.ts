import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDDragon015 } from "../../OP07/characters/015-monkey-d-dragon.ts";
import { op09MonkeyDDragonSp015I18n } from "./015-monkey-d-dragon-sp.i18n.ts";

export const op09MonkeyDDragonSp015: CharacterCard = {
  ...op07MonkeyDDragon015,
  id: "OP07-015_p2",
  slug: "monkey-d-dragon-sp",
  name: "Monkey.D.Dragon (SP)",
  printings: [
    {
      id: "OP07-015_p2",
      artId: "OP07-015_p2",
      setCode: "OP09",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09MonkeyDDragonSp015I18n,
};
