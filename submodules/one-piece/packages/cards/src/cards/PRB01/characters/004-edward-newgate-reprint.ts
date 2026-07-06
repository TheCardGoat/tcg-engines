import type { CharacterCard } from "@tcg/op-types";
import { op02EdwardNewgate004 } from "../../OP02/characters/004-edward-newgate.ts";
import { prb01EdwardNewgateReprint004I18n } from "./004-edward-newgate-reprint.i18n.ts";

export const prb01EdwardNewgateReprint004: CharacterCard = {
  ...op02EdwardNewgate004,
  id: "OP02-004_r1",
  slug: "edward-newgate-reprint",
  name: "Edward.Newgate (Reprint)",
  printings: [
    {
      id: "OP02-004_r1",
      artId: "OP02-004_r1",
      setCode: "PRB01",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-004_r1.jpg",
    },
    {
      id: "OP02-004_p4",
      artId: "OP02-004_p4",
      setCode: "PRB01",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-004_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-004_p4.jpg",
      imageId: "OP02-004_p4",
    },
  ],
  i18n: prb01EdwardNewgateReprint004I18n,
};
