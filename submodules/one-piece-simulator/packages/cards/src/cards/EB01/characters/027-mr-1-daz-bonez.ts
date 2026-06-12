import type { CharacterCard } from "@tcg/op-types";
import { eb01Mr1DazBonez027I18n } from "./027-mr-1-daz-bonez.i18n.ts";

export const eb01Mr1DazBonez027: CharacterCard = {
  id: "EB01-027",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-027_p1.jpg",
      imageId: "EB01-027_p1",
    },
  ],
  effect:
    'If your Leader\'s type includes "Baroque Works", this Character gains +1000 power for every 2 Events in your trash.[On Play] Draw 2 cards and trash 1 card from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
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
  i18n: eb01Mr1DazBonez027I18n,
};
