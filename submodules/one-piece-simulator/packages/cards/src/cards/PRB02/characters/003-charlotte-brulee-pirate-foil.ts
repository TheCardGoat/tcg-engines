import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlotteBruleePirateFoil003I18n } from "./003-charlotte-brulee-pirate-foil.i18n.ts";

export const prb02CharlotteBruleePirateFoil003: CharacterCard = {
  id: "ST20-003",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 3,
  power: 3000,
  counter: 2000,
  trigger:
    "Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, add this card to your hand.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST20-003_r1.jpg",
      imageId: "ST20-003_r1",
    },
  ],
  effect:
    "[Trigger] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, add this card to your hand.",
  i18n: prb02CharlotteBruleePirateFoil003I18n,
};
