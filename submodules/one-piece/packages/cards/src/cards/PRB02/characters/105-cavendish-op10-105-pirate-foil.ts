import type { CharacterCard } from "@tcg/op-types";
import { prb02CavendishOp10105PirateFoil105I18n } from "./105-cavendish-op10-105-pirate-foil.i18n.ts";

export const prb02CavendishOp10105PirateFoil105: CharacterCard = {
  id: "OP10-105",
  canonicalId: "OP10-105",
  slug: "cavendish-op10-105-pirate-foil",
  name: "Cavendish - OP10-105 (Pirate Foil)",
  printings: [
    {
      id: "OP10-105",
      artId: "OP10-105",
      setCode: "PRB02",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-105_p1.jpg",
    },
    {
      id: "OP10-105_r1",
      artId: "OP10-105_r1",
      setCode: "PRB02",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-105_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-105_r1.jpg",
      imageId: "OP10-105_r1",
    },
  ],
  i18n: prb02CavendishOp10105PirateFoil105I18n,
};
