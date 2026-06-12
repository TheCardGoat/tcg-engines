import type { CharacterCard } from "@tcg/op-types";
import { prb02PeronaPirateFoil005I18n } from "./005-perona-pirate-foil.i18n.ts";

export const prb02PeronaPirateFoil005: CharacterCard = {
  id: "ST12-005",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-005_r1.jpg",
      imageId: "ST12-005_r1",
    },
  ],
  i18n: prb02PeronaPirateFoil005I18n,
};
