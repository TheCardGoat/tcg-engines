import type { CharacterCard } from "@tcg/op-types";
import { op13StTopmanWarcury089I18n } from "./089-st-topman-warcury.i18n.ts";

export const op13StTopmanWarcury089: CharacterCard = {
  id: "OP13-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-089_p1_r3ef0LC.jpg",
      imageId: "OP13-089_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-089_p2.jpg",
      imageId: "OP13-089_p2",
    },
  ],
  effect:
    "If you have 7 or more cards in your trash, this Character cannot be removed from the field by your opponent's effects and gains [Blocker].\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13StTopmanWarcury089I18n,
};
