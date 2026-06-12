import type { CharacterCard } from "@tcg/op-types";
import { eb03BoaHancock026I18n } from "./026-boa-hancock.i18n.ts";

export const eb03BoaHancock026: CharacterCard = {
  id: "EB03-026",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "EB03",
  cost: 6,
  power: 8000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-026_p2_slw9xMj.jpg",
      imageId: "EB03-026_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-026_p1_eFWOcPG.jpg",
      imageId: "EB03-026_p1",
    },
  ],
  effect:
    "[On Play] If your opponent has 5 or more cards in their hand, your opponent places 1 card from their hand at the bottom of their deck.\n[Activate: Main] [Once Per Turn] You may place 1 of your Characters at the bottom of the owner's deck: Give your Leader and 1 Character up to 1 rested DON!! card each.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03BoaHancock026I18n,
};
