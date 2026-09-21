import type { CharacterCard } from "@tcg/op-types";
import { prb02PeronaPirateFoil005I18n } from "./st12-005-perona-pirate-foil.i18n.ts";

export const prb02PeronaPirateFoil005: CharacterCard = {
  id: "ST12-005",
  canonicalId: "ST12-005",
  slug: "perona-pirate-foil",
  name: "Perona",
  printings: [
    {
      id: "ST12-005",
      artId: "ST12-005",
      setCode: "ST12",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-005_p1.jpg",
      label: "Perona (Pirate Foil)",
    },
    {
      id: "ST12-005_r1",
      artId: "ST12-005_r1",
      setCode: "ST12",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-005_r1.jpg",
      label: "Perona (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  i18n: prb02PeronaPirateFoil005I18n,
};
