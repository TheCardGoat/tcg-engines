import type { CharacterCard } from "@tcg/op-types";
import { op07BoaHancock051 } from "../../OP07/characters/051-boa-hancock.ts";
import { op09BoaHancockSp051I18n } from "./051-boa-hancock-sp.i18n.ts";

export const op09BoaHancockSp051: CharacterCard = {
  ...op07BoaHancock051,
  id: "OP07-051_p3",
  slug: "boa-hancock-sp/op07-051",
  name: "Boa Hancock (SP)",
  printings: [
    {
      id: "OP07-051_p3",
      artId: "OP07-051_p3",
      setCode: "OP09",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-051_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09BoaHancockSp051I18n,
};
