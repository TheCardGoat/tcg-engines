import type { CharacterCard } from "@tcg/op-types";
import { prb02BrookSt14010PirateFoil010I18n } from "./010-brook-st14-010-pirate-foil.i18n.ts";

export const prb02BrookSt14010PirateFoil010: CharacterCard = {
  id: "ST14-010",
  canonicalId: "ST14-010",
  slug: "brook-st14-010-pirate-foil",
  name: "Brook - ST14-010 (Pirate Foil)",
  printings: [
    {
      id: "ST14-010",
      artId: "ST14-010",
      setCode: "PRB02",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-010_p1.jpg",
    },
    {
      id: "ST14-010_r2",
      artId: "ST14-010_r2",
      setCode: "PRB02",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-010_r2.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-010_r2.jpg",
      imageId: "ST14-010_r2",
    },
  ],
  i18n: prb02BrookSt14010PirateFoil010I18n,
};
