import type { CharacterCard } from "@tcg/op-types";
import { op05Rebecca091 } from "../../OP05/characters/091-rebecca.ts";
import { op06RebeccaSp091I18n } from "./091-rebecca-sp.i18n.ts";

export const op06RebeccaSp091: CharacterCard = {
  ...op05Rebecca091,
  id: "OP05-091_p2",
  slug: "rebecca-sp",
  name: "Rebecca (SP)",
  printings: [
    {
      id: "OP05-091_p2",
      artId: "OP05-091_p2",
      setCode: "OP06",
      collectorNumber: "091",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06RebeccaSp091I18n,
};
