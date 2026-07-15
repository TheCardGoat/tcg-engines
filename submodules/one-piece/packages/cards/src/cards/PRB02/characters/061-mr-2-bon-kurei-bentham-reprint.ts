import type { CharacterCard } from "@tcg/op-types";
import { eb01Mr2BonKureiBentham061 } from "../../EB01/characters/061-mr-2-bon-kurei-bentham.ts";
import { prb02Mr2BonKureiBenthamReprint061I18n } from "./061-mr-2-bon-kurei-bentham-reprint.i18n.ts";

export const prb02Mr2BonKureiBenthamReprint061: CharacterCard = {
  ...eb01Mr2BonKureiBentham061,
  id: "EB01-061_r1",
  slug: "mr-2-bon-kurei-bentham-reprint",
  name: "Mr.2.Bon.Kurei (Bentham) (Reprint)",
  printings: [
    {
      id: "EB01-061_r1",
      artId: "EB01-061_r1",
      setCode: "PRB02",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-061_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02Mr2BonKureiBenthamReprint061I18n,
};
