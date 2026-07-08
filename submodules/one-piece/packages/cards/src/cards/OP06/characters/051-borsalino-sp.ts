import type { CharacterCard } from "@tcg/op-types";
import { op05Borsalino051 } from "../../OP05/characters/051-borsalino.ts";
import { op06BorsalinoSp051I18n } from "./051-borsalino-sp.i18n.ts";

export const op06BorsalinoSp051: CharacterCard = {
  ...op05Borsalino051,
  id: "OP05-051_p2",
  slug: "borsalino-sp",
  name: "Borsalino (SP)",
  printings: [
    {
      id: "OP05-051_p2",
      artId: "OP05-051_p2",
      setCode: "OP06",
      collectorNumber: "051",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-051_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06BorsalinoSp051I18n,
};
