import type { CharacterCard } from "@tcg/op-types";
import { op04Kaido044 } from "../../OP04/characters/044-kaido.ts";
import { op05KaidoSp044I18n } from "./044-kaido-sp.i18n.ts";

export const op05KaidoSp044: CharacterCard = {
  ...op04Kaido044,
  id: "OP04-044_p2",
  slug: "kaido-sp",
  name: "Kaido (SP)",
  printings: [
    {
      id: "OP04-044_p2",
      artId: "OP04-044_p2",
      setCode: "OP05",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP05",
  artVariants: undefined,
  i18n: op05KaidoSp044I18n,
};
