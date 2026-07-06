import type { CharacterCard } from "@tcg/op-types";
import { op06Sanji119 } from "../../OP06/characters/119-sanji.ts";
import { op11SanjiSp119I18n } from "./119-sanji-sp.i18n.ts";

export const op11SanjiSp119: CharacterCard = {
  ...op06Sanji119,
  id: "OP06-119_p2",
  slug: "sanji-sp/op06-119",
  name: "Sanji (SP)",
  printings: [
    {
      id: "OP06-119_p2",
      artId: "OP06-119_p2",
      setCode: "OP11",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_p2.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP11",
  artVariants: undefined,
  i18n: op11SanjiSp119I18n,
};
