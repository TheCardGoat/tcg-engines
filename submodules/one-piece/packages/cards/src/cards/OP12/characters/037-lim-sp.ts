import type { CharacterCard } from "@tcg/op-types";
import { op09Lim037 } from "../../OP09/characters/037-lim.ts";
import { op12LimSp037I18n } from "./037-lim-sp.i18n.ts";

export const op12LimSp037: CharacterCard = {
  ...op09Lim037,
  id: "OP09-037_p2_9ZL08cD",
  slug: "lim-sp",
  name: "Lim (SP)",
  printings: [
    {
      id: "OP09-037_p2_9ZL08cD",
      artId: "OP09-037_p2_9ZL08cD",
      setCode: "OP12",
      collectorNumber: "037",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-037_p2_9ZL08cD.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12LimSp037I18n,
};
