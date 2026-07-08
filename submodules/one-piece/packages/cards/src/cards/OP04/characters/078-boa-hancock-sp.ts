import type { CharacterCard } from "@tcg/op-types";
import { op01BoaHancock078 } from "../../OP01/characters/078-boa-hancock.ts";
import { op04BoaHancockSp078I18n } from "./078-boa-hancock-sp.i18n.ts";

export const op04BoaHancockSp078: CharacterCard = {
  ...op01BoaHancock078,
  id: "OP01-078_p2",
  slug: "boa-hancock-sp/op01-078",
  name: "Boa Hancock (SP)",
  printings: [
    {
      id: "OP01-078_p2",
      artId: "OP01-078_p2",
      setCode: "OP04",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04BoaHancockSp078I18n,
};
