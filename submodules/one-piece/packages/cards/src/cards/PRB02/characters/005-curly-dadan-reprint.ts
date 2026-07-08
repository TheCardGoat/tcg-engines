import type { CharacterCard } from "@tcg/op-types";
import { op02CurlyDadan005 } from "../../OP02/characters/005-curly-dadan.ts";
import { prb02CurlyDadanReprint005I18n } from "./005-curly-dadan-reprint.i18n.ts";

export const prb02CurlyDadanReprint005: CharacterCard = {
  ...op02CurlyDadan005,
  id: "OP02-005_r1",
  slug: "curly-dadan-reprint",
  name: "Curly.Dadan (Reprint)",
  printings: [
    {
      id: "OP02-005_r1",
      artId: "OP02-005_r1",
      setCode: "PRB02",
      collectorNumber: "005",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-005_r1.jpg",
    },
    {
      id: "OP02-005_p1",
      artId: "OP02-005_p1",
      setCode: "PRB02",
      collectorNumber: "005",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-005_p1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-005_p1.jpg",
      imageId: "OP02-005_p1",
    },
  ],
  i18n: prb02CurlyDadanReprint005I18n,
};
