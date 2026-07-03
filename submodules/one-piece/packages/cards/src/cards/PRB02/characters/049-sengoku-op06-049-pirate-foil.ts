import type { CharacterCard } from "@tcg/op-types";
import { prb02SengokuOp06049PirateFoil049I18n } from "./049-sengoku-op06-049-pirate-foil.i18n.ts";

export const prb02SengokuOp06049PirateFoil049: CharacterCard = {
  id: "OP06-049",
  canonicalId: "OP06-049",
  slug: "sengoku-op06-049-pirate-foil",
  name: "Sengoku - OP06-049 (Pirate Foil)",
  printings: [
    {
      id: "OP06-049",
      artId: "OP06-049",
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
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-049_r1.jpg",
      imageId: "OP06-049_r1",
    },
  ],
  i18n: prb02SengokuOp06049PirateFoil049I18n,
};
