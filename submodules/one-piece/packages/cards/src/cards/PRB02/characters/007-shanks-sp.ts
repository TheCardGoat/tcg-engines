import type { CharacterCard } from "@tcg/op-types";
import { op06Shanks007 } from "../../OP06/characters/007-shanks.ts";
import { prb02ShanksSp007I18n } from "./007-shanks-sp.i18n.ts";

export const prb02ShanksSp007: CharacterCard = {
  ...op06Shanks007,
  id: "OP06-007_p6",
  slug: "shanks-sp/op06-007",
  name: "Shanks (SP)",
  printings: [
    {
      id: "OP06-007_p6",
      artId: "OP06-007_p6",
      setCode: "PRB02",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-007_p6.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02ShanksSp007I18n,
};
