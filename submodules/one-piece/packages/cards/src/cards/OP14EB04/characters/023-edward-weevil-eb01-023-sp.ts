import type { CharacterCard } from "@tcg/op-types";
import { eb01EdwardWeevil023 } from "../../EB01/characters/023-edward-weevil.ts";
import { op14eb04EdwardWeevilEb01023Sp023I18n } from "./023-edward-weevil-eb01-023-sp.i18n.ts";

export const op14eb04EdwardWeevilEb01023Sp023: CharacterCard = {
  ...eb01EdwardWeevil023,
  id: "EB01-023_p1",
  slug: "edward-weevil-eb01-023-sp",
  name: "Edward Weevil - EB01-023 (SP)",
  printings: [
    {
      id: "EB01-023_p1",
      artId: "EB01-023_p1",
      setCode: "OP14EB04",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-023_p1.png",
    },
  ],
  rarity: "R",
  setId: "OP14EB04",
  artVariants: undefined,
  i18n: op14eb04EdwardWeevilEb01023Sp023I18n,
};
