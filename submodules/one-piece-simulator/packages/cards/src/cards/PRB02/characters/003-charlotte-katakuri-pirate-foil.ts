import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlotteKatakuriPirateFoil003I18n } from "./003-charlotte-katakuri-pirate-foil.i18n.ts";

export const prb02CharlotteKatakuriPirateFoil003: CharacterCard = {
  id: "ST16-003",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-003_r1.jpg",
      imageId: "ST16-003_r1",
    },
  ],
  effect:
    'If your Leader has the "FILM" type and you have 6 or more rested cards, this Character gains +2000 power.',
  i18n: prb02CharlotteKatakuriPirateFoil003I18n,
};
