import type { CharacterCard } from "@tcg/op-types";
import { eb01CharlotteFlampe056 } from "../../EB01/characters/056-charlotte-flampe.ts";
import { op10CharlotteFlampeSp056I18n } from "./056-charlotte-flampe-sp.i18n.ts";

export const op10CharlotteFlampeSp056: CharacterCard = {
  ...eb01CharlotteFlampe056,
  id: "EB01-056_p2",
  slug: "charlotte-flampe-sp",
  name: "Charlotte Flampe (SP)",
  printings: [
    {
      id: "EB01-056_p2",
      artId: "EB01-056_p2",
      setCode: "OP10",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-056_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP10",
  artVariants: undefined,
  i18n: op10CharlotteFlampeSp056I18n,
};
