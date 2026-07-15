import type { CharacterCard } from "@tcg/op-types";
import { op03CharlottePudding112 } from "../../OP03/characters/112-charlotte-pudding.ts";
import { op08CharlottePuddingSp112I18n } from "./112-charlotte-pudding-sp.i18n.ts";

export const op08CharlottePuddingSp112: CharacterCard = {
  ...op03CharlottePudding112,
  id: "OP03-112_p4",
  slug: "charlotte-pudding-sp/op03-112",
  name: "Charlotte Pudding (SP)",
  printings: [
    {
      id: "OP03-112_p4",
      artId: "OP03-112_p4",
      setCode: "OP08",
      collectorNumber: "112",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-112_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "OP08",
  artVariants: undefined,
  i18n: op08CharlottePuddingSp112I18n,
};
