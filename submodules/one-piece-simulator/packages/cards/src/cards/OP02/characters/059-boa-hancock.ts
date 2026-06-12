import type { CharacterCard } from "@tcg/op-types";
import { op02BoaHancock059I18n } from "./059-boa-hancock.i18n.ts";

export const op02BoaHancock059: CharacterCard = {
  id: "OP02-059",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea Impel Down"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-059_p1.jpg",
      imageId: "OP02-059_p1",
    },
  ],
  effect:
    "[When Attacking] Draw 1 card and trash 1 card from your hand. Then, trash up to 3 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op02BoaHancock059I18n,
};
