import type { CharacterCard } from "@tcg/op-types";
import { prb02AdioPirateFoil078I18n } from "./078-adio-pirate-foil.i18n.ts";

export const prb02AdioPirateFoil078: CharacterCard = {
  id: "P-078",
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["ODYSSEY"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-078_r1.jpg",
      imageId: "P-078_r1",
    },
  ],
  effect:
    'If you have 2 or more rested "ODYSSEY" type Characters, this Character gains +1000 power.',
  i18n: prb02AdioPirateFoil078I18n,
};
