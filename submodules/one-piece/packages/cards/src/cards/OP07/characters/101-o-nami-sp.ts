import type { CharacterCard } from "@tcg/op-types";
import { op06ONami101 } from "../../OP06/characters/101-o-nami.ts";
import { op07ONamiSp101I18n } from "./101-o-nami-sp.i18n.ts";

export const op07ONamiSp101: CharacterCard = {
  ...op06ONami101,
  id: "OP06-101_p2",
  slug: "o-nami-sp",
  name: "O-Nami (SP)",
  printings: [
    {
      id: "OP06-101_p2",
      artId: "OP06-101_p2",
      setCode: "OP07",
      collectorNumber: "101",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-101_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07ONamiSp101I18n,
};
