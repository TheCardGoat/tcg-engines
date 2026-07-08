import type { CharacterCard } from "@tcg/op-types";
import { op06Sengoku049 } from "../../OP06/characters/049-sengoku.ts";
import { prb02SengokuOp06049PirateFoil049I18n } from "./049-sengoku-op06-049-pirate-foil.i18n.ts";

export const prb02SengokuOp06049PirateFoil049: CharacterCard = {
  ...op06Sengoku049,
  id: "OP06-049_p1",
  slug: "sengoku-op06-049-pirate-foil",
  name: "Sengoku - OP06-049 (Pirate Foil)",
  printings: [
    {
      id: "OP06-049_p1",
      artId: "OP06-049_p1",
      setCode: "PRB02",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-049_p1.jpg",
    },
    {
      id: "OP06-049_r1",
      artId: "OP06-049_r1",
      setCode: "PRB02",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-049_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-049_r1.jpg",
      imageId: "OP06-049_r1",
    },
  ],
  i18n: prb02SengokuOp06049PirateFoil049I18n,
};
