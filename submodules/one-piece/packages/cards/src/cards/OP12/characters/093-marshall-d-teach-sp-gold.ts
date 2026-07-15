import type { CharacterCard } from "@tcg/op-types";
import { op09MarshallDTeach093 } from "../../OP09/characters/093-marshall-d-teach.ts";
import { op12MarshallDTeachSpGold093I18n } from "./093-marshall-d-teach-sp-gold.i18n.ts";

export const op12MarshallDTeachSpGold093: CharacterCard = {
  ...op09MarshallDTeach093,
  id: "OP09-093_p5_esui2Sk",
  slug: "marshall-d-teach-sp-gold",
  name: "Marshall.D.Teach (SP) (Gold)",
  printings: [
    {
      id: "OP09-093_p5_esui2Sk",
      artId: "OP09-093_p5_esui2Sk",
      setCode: "OP12",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p5_esui2Sk.jpg",
    },
    {
      id: "OP09-093_p4",
      artId: "OP09-093_p4",
      setCode: "OP12",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p4_yGd9lfW.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP12",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p4_yGd9lfW.jpg",
      imageId: "OP09-093_p4",
    },
  ],
  i18n: op12MarshallDTeachSpGold093I18n,
};
