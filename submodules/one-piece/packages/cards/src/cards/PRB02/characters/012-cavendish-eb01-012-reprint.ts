import type { CharacterCard } from "@tcg/op-types";
import { eb01Cavendish012 } from "../../EB01/characters/012-cavendish.ts";
import { prb02CavendishEb01012Reprint012I18n } from "./012-cavendish-eb01-012-reprint.i18n.ts";

export const prb02CavendishEb01012Reprint012: CharacterCard = {
  ...eb01Cavendish012,
  id: "EB01-012_r1",
  slug: "cavendish-eb01-012-reprint",
  name: "Cavendish - EB01-012 (Reprint)",
  printings: [
    {
      id: "EB01-012_r1",
      artId: "EB01-012_r1",
      setCode: "PRB02",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-012_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02CavendishEb01012Reprint012I18n,
};
