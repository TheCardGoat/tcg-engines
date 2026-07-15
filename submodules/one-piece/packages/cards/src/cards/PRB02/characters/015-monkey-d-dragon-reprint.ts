import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDDragon015 } from "../../OP07/characters/015-monkey-d-dragon.ts";
import { prb02MonkeyDDragonReprint015I18n } from "./015-monkey-d-dragon-reprint.i18n.ts";

export const prb02MonkeyDDragonReprint015: CharacterCard = {
  ...op07MonkeyDDragon015,
  id: "OP07-015_r1",
  slug: "monkey-d-dragon-reprint",
  name: "Monkey.D.Dragon (Reprint)",
  printings: [
    {
      id: "OP07-015_r1",
      artId: "OP07-015_r1",
      setCode: "PRB02",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-015_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02MonkeyDDragonReprint015I18n,
};
