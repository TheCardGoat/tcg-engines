import type { CharacterCard } from "@tcg/op-types";
import { op01TrafalgarLaw047 } from "../../OP01/characters/047-trafalgar-law.ts";
import { op04TrafalgarLawSp047I18n } from "./047-trafalgar-law-sp.i18n.ts";

export const op04TrafalgarLawSp047: CharacterCard = {
  ...op01TrafalgarLaw047,
  id: "OP01-047_p2",
  slug: "trafalgar-law-sp",
  name: "Trafalgar Law (SP)",
  printings: [
    {
      id: "OP01-047_p2",
      artId: "OP01-047_p2",
      setCode: "OP04",
      collectorNumber: "047",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04TrafalgarLawSp047I18n,
};
