import type { CharacterCard } from "@tcg/op-types";
import { op03Issho078 } from "../../OP03/characters/078-issho.ts";
import { op07IsshoSp078I18n } from "./078-issho-sp.i18n.ts";

export const op07IsshoSp078: CharacterCard = {
  ...op03Issho078,
  id: "OP03-078_p2",
  slug: "issho-sp",
  name: "Issho (SP)",
  printings: [
    {
      id: "OP03-078_p2",
      artId: "OP03-078_p2",
      setCode: "OP07",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-078_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07IsshoSp078I18n,
};
