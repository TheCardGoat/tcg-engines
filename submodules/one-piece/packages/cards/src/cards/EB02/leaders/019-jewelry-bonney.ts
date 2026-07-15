import type { LeaderCard } from "@tcg/op-types";
import { op07JewelryBonney019 } from "../../OP07/leaders/019-jewelry-bonney.ts";
import { eb02JewelryBonney019I18n } from "./019-jewelry-bonney.i18n.ts";

export const eb02JewelryBonney019: LeaderCard = {
  ...op07JewelryBonney019,
  id: "OP07-019_5dJaBbJ",
  slug: "jewelry-bonney/op07-019-5djabbj",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "OP07-019_5dJaBbJ",
      artId: "OP07-019_5dJaBbJ",
      setCode: "EB02",
      collectorNumber: "019",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-019_5dJaBbJ.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02JewelryBonney019I18n,
};
