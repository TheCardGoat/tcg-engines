import type { CharacterCard } from "@tcg/op-types";
import { op01Yamato121 } from "../../OP01/characters/121-yamato.ts";
import { prb01YamatoOp01121Reprint121I18n } from "./121-yamato-op01-121-reprint.i18n.ts";

export const prb01YamatoOp01121Reprint121: CharacterCard = {
  ...op01Yamato121,
  id: "OP01-121_p7",
  slug: "yamato-op01-121-reprint",
  name: "Yamato (OP01-121) (Reprint)",
  printings: [
    {
      id: "OP01-121_p7",
      artId: "OP01-121_p7",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p7.jpg",
    },
    {
      id: "OP01-121_p4",
      artId: "OP01-121_p4",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p4.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p4.jpg",
      imageId: "OP01-121_p4",
    },
  ],
  i18n: prb01YamatoOp01121Reprint121I18n,
};
