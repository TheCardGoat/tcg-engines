import type { CharacterCard } from "@tcg/op-types";
import { op15Spoil083I18n } from "./op15-083-spoil.i18n.ts";

export const op15Spoil083: CharacterCard = {
  id: "OP15-083",
  canonicalId: "OP15-083",
  slug: "spoil/op15-083",
  name: "Spoil",
  printings: [
    {
      id: "OP15-083",
      artId: "OP15-083",
      setCode: "OP15",
      collectorNumber: "083",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-083.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["The Victims' Club"],
  attribute: "wisdom",
  effect:
    "[On Play] Trash 3 cards from the top of your deck. [Activate: Main] You may trash this Character: If you have 15 or more cards in your trash, give up to 1 rested DON!! card to 1 of your Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
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
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 15,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15Spoil083I18n,
};
