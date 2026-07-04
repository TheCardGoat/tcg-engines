import type { CharacterCard } from "@tcg/op-types";
import { op09MarshallDTeach092I18n } from "./092-marshall-d-teach.i18n.ts";

export const op09MarshallDTeach092: CharacterCard = {
  id: "OP09-092",
  canonicalId: "OP09-092",
  slug: "marshall-d-teach/op09-092",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP09-092",
      artId: "OP09-092",
      setCode: "OP09",
      collectorNumber: "092",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-092.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: If the number of cards in your hand is at least 3 less than the number in your opponent's hand, draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09MarshallDTeach092I18n,
};
