import type { CharacterCard } from "@tcg/op-types";
import { op09LuckyRoux015 } from "../../OP09/characters/015-lucky-roux.ts";
import { op11LuckyRouxTr015I18n } from "./015-lucky-roux-tr.i18n.ts";

export const op11LuckyRouxTr015: CharacterCard = {
  ...op09LuckyRoux015,
  id: "OP09-015_p1",
  slug: "lucky-roux-tr",
  name: "Lucky.Roux (TR)",
  printings: [
    {
      id: "OP09-015_p1",
      artId: "OP09-015_p1",
      setCode: "OP11",
      collectorNumber: "015",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-015_p1.jpg",
    },
  ],
  rarity: "TR",
  setId: "OP11",
  artVariants: undefined,
  i18n: op11LuckyRouxTr015I18n,
};
