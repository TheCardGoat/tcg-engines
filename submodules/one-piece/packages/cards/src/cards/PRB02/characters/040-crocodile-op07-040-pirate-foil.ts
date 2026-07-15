import type { CharacterCard } from "@tcg/op-types";
import { op07Crocodile040 } from "../../OP07/characters/040-crocodile.ts";
import { prb02CrocodileOp07040PirateFoil040I18n } from "./040-crocodile-op07-040-pirate-foil.i18n.ts";

export const prb02CrocodileOp07040PirateFoil040: CharacterCard = {
  ...op07Crocodile040,
  id: "OP07-040_p2",
  slug: "crocodile-op07-040-pirate-foil",
  name: "Crocodile - OP07-040 (Pirate Foil)",
  printings: [
    {
      id: "OP07-040_p2",
      artId: "OP07-040_p2",
      setCode: "PRB02",
      collectorNumber: "040",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_p2.jpg",
    },
    {
      id: "OP07-040_r1",
      artId: "OP07-040_r1",
      setCode: "PRB02",
      collectorNumber: "040",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_r1.jpg",
    },
    {
      id: "OP07-040_p3",
      artId: "OP07-040_p3",
      setCode: "PRB02",
      collectorNumber: "040",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_p3.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_r1.jpg",
      imageId: "OP07-040_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-040_p3.jpg",
      imageId: "OP07-040_p3",
    },
  ],
  i18n: prb02CrocodileOp07040PirateFoil040I18n,
};
