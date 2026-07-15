import type { CharacterCard } from "@tcg/op-types";
import { op01TrafalgarLaw047 } from "../../OP01/characters/047-trafalgar-law.ts";
import { prb01TrafalgarLaw047I18n } from "./047-trafalgar-law.i18n.ts";

export const prb01TrafalgarLaw047: CharacterCard = {
  ...op01TrafalgarLaw047,
  id: "OP01-047_r1",
  slug: "trafalgar-law/op01-047-r1",
  name: "Trafalgar Law",
  printings: [
    {
      id: "OP01-047_r1",
      artId: "OP01-047_r1",
      setCode: "PRB01",
      collectorNumber: "047",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_r1.png",
    },
    {
      id: "OP01-047_p4",
      artId: "OP01-047_p4",
      setCode: "PRB01",
      collectorNumber: "047",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_p4.jpg",
      imageId: "OP01-047_p4",
    },
  ],
  i18n: prb01TrafalgarLaw047I18n,
};
