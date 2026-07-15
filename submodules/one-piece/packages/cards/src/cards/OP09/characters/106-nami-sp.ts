import type { CharacterCard } from "@tcg/op-types";
import { op08Nami106 } from "../../OP08/characters/106-nami.ts";
import { op09NamiSp106I18n } from "./106-nami-sp.i18n.ts";

export const op09NamiSp106: CharacterCard = {
  ...op08Nami106,
  id: "OP08-106_p2",
  slug: "nami-sp/op08-106",
  name: "Nami (SP)",
  printings: [
    {
      id: "OP08-106_p2",
      artId: "OP08-106_p2",
      setCode: "OP09",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-106_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09NamiSp106I18n,
};
