import type { CharacterCard } from "@tcg/op-types";
import { op02Uta120 } from "../../OP02/characters/120-uta.ts";
import { op05UtaSp120I18n } from "./120-uta-sp.i18n.ts";

export const op05UtaSp120: CharacterCard = {
  ...op02Uta120,
  id: "OP02-120_p2",
  slug: "uta-sp/op02-120",
  name: "Uta (SP)",
  printings: [
    {
      id: "OP02-120_p2",
      artId: "OP02-120_p2",
      setCode: "OP05",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-120_p2.jpg",
    },
  ],
  rarity: "SEC",
  setId: "OP05",
  artVariants: undefined,
  i18n: op05UtaSp120I18n,
};
