import type { CharacterCard } from "@tcg/op-types";
import { op02Borsalino114 } from "../../OP02/characters/114-borsalino.ts";
import { prb01BorsalinoReprint114I18n } from "./114-borsalino-reprint.i18n.ts";

export const prb01BorsalinoReprint114: CharacterCard = {
  ...op02Borsalino114,
  id: "OP02-114_r3",
  slug: "borsalino-reprint",
  name: "Borsalino (Reprint)",
  printings: [
    {
      id: "OP02-114_r3",
      artId: "OP02-114_r3",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-114_r3.jpg",
    },
    {
      id: "OP02-114_p3",
      artId: "OP02-114_p3",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-114_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-114_p3.jpg",
      imageId: "OP02-114_p3",
    },
  ],
  i18n: prb01BorsalinoReprint114I18n,
};
