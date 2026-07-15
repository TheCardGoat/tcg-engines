import type { CharacterCard } from "@tcg/op-types";
import { op02EdwardNewgate004 } from "../../OP02/characters/004-edward-newgate.ts";
import { op04EdwardNewgateSp004I18n } from "./004-edward-newgate-sp.i18n.ts";

export const op04EdwardNewgateSp004: CharacterCard = {
  ...op02EdwardNewgate004,
  id: "OP02-004_p2",
  slug: "edward-newgate-sp/op02-004",
  name: "Edward.Newgate (SP)",
  printings: [
    {
      id: "OP02-004_p2",
      artId: "OP02-004_p2",
      setCode: "OP04",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-004_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04EdwardNewgateSp004I18n,
};
