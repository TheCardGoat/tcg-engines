import type { CharacterCard } from "@tcg/op-types";
import { op05MonkeyDLuffy119 } from "../../OP05/characters/119-monkey-d-luffy.ts";
import { op11MonkeyDLuffySp119I18n } from "./119-monkey-d-luffy-sp.i18n.ts";

export const op11MonkeyDLuffySp119: CharacterCard = {
  ...op05MonkeyDLuffy119,
  id: "OP05-119_p7",
  slug: "monkey-d-luffy-sp/op05-119",
  name: "Monkey.D.Luffy (SP)",
  printings: [
    {
      id: "OP05-119_p7",
      artId: "OP05-119_p7",
      setCode: "OP11",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p7.jpg",
    },
    {
      id: "OP05-119_p8",
      artId: "OP05-119_p8",
      setCode: "OP11",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p8.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP11",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p8.jpg",
      imageId: "OP05-119_p8",
    },
  ],
  i18n: op11MonkeyDLuffySp119I18n,
};
