import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeSora063 } from "../../OP06/characters/063-vinsmoke-sora.ts";
import { prb02VinsmokeSoraPirateFoil063I18n } from "./063-vinsmoke-sora-pirate-foil.i18n.ts";

export const prb02VinsmokeSoraPirateFoil063: CharacterCard = {
  ...op06VinsmokeSora063,
  id: "OP06-063_r1_gDLU3wS",
  slug: "vinsmoke-sora-pirate-foil",
  name: "Vinsmoke Sora (Pirate Foil)",
  printings: [
    {
      id: "OP06-063_r1_gDLU3wS",
      artId: "OP06-063_r1_gDLU3wS",
      setCode: "PRB02",
      collectorNumber: "063",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-063_r1_gDLU3wS.jpg",
    },
    {
      id: "OP06-063_r1",
      artId: "OP06-063_r1",
      setCode: "PRB02",
      collectorNumber: "063",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-063_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-063_r1.jpg",
      imageId: "OP06-063_r1",
    },
  ],
  i18n: prb02VinsmokeSoraPirateFoil063I18n,
};
