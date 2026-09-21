import type { CharacterCard } from "@tcg/op-types";
import { prb02BrookSt14010PirateFoil010I18n } from "./st14-010-brook-st14-010-pirate-foil.i18n.ts";

export const prb02BrookSt14010PirateFoil010: CharacterCard = {
  id: "ST14-010",
  canonicalId: "ST14-010",
  slug: "brook-st14-010-pirate-foil",
  name: "Brook",
  printings: [
    {
      id: "ST14-010",
      artId: "ST14-010",
      setCode: "ST14",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-010_p1.jpg",
      label: "Brook - ST14-010 (Pirate Foil)",
    },
    {
      id: "ST14-010_r2",
      artId: "ST14-010_r2",
      setCode: "ST14",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-010_r2.jpg",
      label: "Brook - ST14-010 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  i18n: prb02BrookSt14010PirateFoil010I18n,
};
