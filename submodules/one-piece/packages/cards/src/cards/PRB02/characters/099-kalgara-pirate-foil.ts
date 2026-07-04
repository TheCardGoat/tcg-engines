import type { CharacterCard } from "@tcg/op-types";
import { prb02KalgaraPirateFoil099I18n } from "./099-kalgara-pirate-foil.i18n.ts";

export const prb02KalgaraPirateFoil099: CharacterCard = {
  id: "OP08-099",
  canonicalId: "OP08-099",
  slug: "kalgara-pirate-foil",
  name: "Kalgara (Pirate Foil)",
  printings: [
    {
      id: "OP08-099",
      artId: "OP08-099",
      setCode: "PRB02",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_p1.jpg",
    },
    {
      id: "OP08-099_r1",
      artId: "OP08-099_r1",
      setCode: "PRB02",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_r1.jpg",
      imageId: "OP08-099_r1",
    },
  ],
  i18n: prb02KalgaraPirateFoil099I18n,
};
