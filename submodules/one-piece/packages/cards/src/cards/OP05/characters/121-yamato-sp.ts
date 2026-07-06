import type { CharacterCard } from "@tcg/op-types";
import { op01Yamato121 } from "../../OP01/characters/121-yamato.ts";
import { op05YamatoSp121I18n } from "./121-yamato-sp.i18n.ts";

export const op05YamatoSp121: CharacterCard = {
  ...op01Yamato121,
  id: "OP01-121_p2",
  slug: "yamato-sp",
  name: "Yamato (SP)",
  printings: [
    {
      id: "OP01-121_p2",
      artId: "OP01-121_p2",
      setCode: "OP05",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p2.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP05",
  artVariants: undefined,
  i18n: op05YamatoSp121I18n,
};
