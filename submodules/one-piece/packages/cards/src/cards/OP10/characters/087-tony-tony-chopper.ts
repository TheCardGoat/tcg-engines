import type { CharacterCard } from "@tcg/op-types";
import { op10TonyTonyChopper087I18n } from "./087-tony-tony-chopper.i18n.ts";

export const op10TonyTonyChopper087: CharacterCard = {
  id: "OP10-087",
  canonicalId: "OP10-087",
  slug: "tony-tony-chopper/op10-087",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP10-087",
      artId: "OP10-087",
      setCode: "OP10",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-087.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Animal Straw Hat Crew Dressrosa"],
  attribute: "strike",
  effect:
    '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "leader",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                  ],
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 5,
            },
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10TonyTonyChopper087I18n,
};
