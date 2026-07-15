import type { CharacterCard } from "@tcg/op-types";
import { op11ShanksSp004 } from "../../OP11/characters/004-shanks-sp.ts";
import { prb02ShanksSt16004Reprint004I18n } from "./004-shanks-st16-004-reprint.i18n.ts";

export const prb02ShanksSt16004Reprint004: CharacterCard = {
  ...op11ShanksSp004,
  id: "ST16-004_r1",
  slug: "shanks-st16-004-reprint",
  name: "Shanks - ST16-004 (Reprint)",
  printings: [
    {
      id: "ST16-004_r1",
      artId: "ST16-004_r1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_r1.jpg",
    },
    {
      id: "ST16-004_p2",
      artId: "ST16-004_p2",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-004_p2.jpg",
      imageId: "ST16-004_p2",
    },
  ],
  i18n: prb02ShanksSt16004Reprint004I18n,
};
