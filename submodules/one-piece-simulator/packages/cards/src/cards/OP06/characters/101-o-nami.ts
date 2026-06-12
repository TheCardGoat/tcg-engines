import type { CharacterCard } from "@tcg/op-types";
import { op06ONami101I18n } from "./101-o-nami.i18n.ts";

export const op06ONami101: CharacterCard = {
  id: "OP06-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  traits: ["Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-101_p1.jpg",
      imageId: "OP06-101_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your Leader or Character cards gains [Banish] during this turn.\n(When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06ONami101I18n,
};
