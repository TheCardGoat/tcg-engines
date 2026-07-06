import type { CharacterCard } from "@tcg/op-types";
import { st01Nami007 } from "../../ST01/index.ts";
import { op06NamiTr007I18n } from "./007-nami-tr.i18n.ts";

export const op06NamiTr007: CharacterCard = {
  ...st01Nami007,
  id: "ST01-007_p3",
  slug: "nami-tr",
  name: "Nami (TR)",
  printings: [
    {
      id: "ST01-007_p3",
      artId: "ST01-007_p3",
      setCode: "OP06",
      collectorNumber: "007",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-007_p3.jpg",
    },
  ],
  rarity: "TR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06NamiTr007I18n,
};
