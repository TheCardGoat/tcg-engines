import type { CharacterCard } from "@tcg/op-types";
import { op10VinsmokeSanji063 } from "../../OP10/characters/063-vinsmoke-sanji.ts";
import { op12VinsmokeSanjiTr063I18n } from "./063-vinsmoke-sanji-tr.i18n.ts";

export const op12VinsmokeSanjiTr063: CharacterCard = {
  ...op10VinsmokeSanji063,
  id: "OP10-063_p3",
  slug: "vinsmoke-sanji-tr",
  name: "Vinsmoke Sanji (TR)",
  printings: [
    {
      id: "OP10-063_p3",
      artId: "OP10-063_p3",
      setCode: "OP12",
      collectorNumber: "063",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-063_p3.jpg",
    },
  ],
  rarity: "TR",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12VinsmokeSanjiTr063I18n,
};
