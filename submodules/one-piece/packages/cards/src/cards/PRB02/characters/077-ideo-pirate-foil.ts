import type { CharacterCard } from "@tcg/op-types";
import { op04Ideo077 } from "../../OP04/characters/077-ideo.ts";
import { prb02IdeoPirateFoil077I18n } from "./077-ideo-pirate-foil.i18n.ts";

export const prb02IdeoPirateFoil077: CharacterCard = {
  ...op04Ideo077,
  id: "OP04-077_p1",
  slug: "ideo-pirate-foil",
  name: "Ideo (Pirate Foil)",
  printings: [
    {
      id: "OP04-077_p1",
      artId: "OP04-077_p1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_p1.jpg",
    },
    {
      id: "OP04-077_r1",
      artId: "OP04-077_r1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-077_r1.jpg",
      imageId: "OP04-077_r1",
    },
  ],
  i18n: prb02IdeoPirateFoil077I18n,
};
