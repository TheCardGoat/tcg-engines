import type { CharacterCard } from "@tcg/op-types";
import { op07Sengoku046 } from "../../OP07/characters/046-sengoku.ts";
import { op14eb04SengokuOp07046Sp046I18n } from "./046-sengoku-op07-046-sp.i18n.ts";

export const op14eb04SengokuOp07046Sp046: CharacterCard = {
  ...op07Sengoku046,
  id: "OP07-046_p2",
  slug: "sengoku-op07-046-sp",
  name: "Sengoku - OP07-046 (SP)",
  printings: [
    {
      id: "OP07-046_p2",
      artId: "OP07-046_p2",
      setCode: "OP14EB04",
      collectorNumber: "046",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-046_p2.png",
    },
  ],
  rarity: "R",
  setId: "OP14EB04",
  artVariants: undefined,
  i18n: op14eb04SengokuOp07046Sp046I18n,
};
