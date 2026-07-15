import type { CharacterCard } from "@tcg/op-types";
import { op07Sabo118 } from "../../OP07/characters/118-sabo.ts";
import { op13SaboOp07118Sp118I18n } from "./118-sabo-op07-118-sp.i18n.ts";

export const op13SaboOp07118Sp118: CharacterCard = {
  ...op07Sabo118,
  id: "OP07-118_p2_PCjCKMT",
  slug: "sabo-op07-118-sp",
  name: "Sabo - OP07-118 (SP)",
  printings: [
    {
      id: "OP07-118_p2_PCjCKMT",
      artId: "OP07-118_p2_PCjCKMT",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118_p2_PCjCKMT.png",
    },
  ],
  rarity: "SEC",
  setId: "OP13",
  artVariants: undefined,
  i18n: op13SaboOp07118Sp118I18n,
};
