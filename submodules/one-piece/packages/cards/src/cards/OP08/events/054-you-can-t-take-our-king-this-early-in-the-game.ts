import type { EventCard } from "@tcg/op-types";
import { op08YouCanTTakeOurKingThisEarlyInTheGame054I18n } from "./054-you-can-t-take-our-king-this-early-in-the-game.i18n.ts";

export const op08YouCanTTakeOurKingThisEarlyInTheGame054: EventCard = {
  id: "OP08-054",
  canonicalId: "OP08-054",
  slug: "you-can-t-take-our-king-this-early-in-the-game",
  name: "You Can't Take Our King This Early in the Game.",
  printings: [
    {
      id: "OP08-054",
      artId: "OP08-054",
      setCode: "OP08",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-054.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, reveal 1 card from the top of your deck and play up to 1 Character card with a type including "Whitebeard Pirates" and a cost of 3 or less. Then, place the rest at the top or bottom of your deck.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                { filter: "cost", comparison: "lte", value: 3 },
                { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              actions: [
                {
                  action: "play",
                  source: { player: "self", zone: "deck" },
                  count: { amount: 1, upTo: true },
                  filters: [
                    { filter: "cost", comparison: "lte", value: 3 },
                    { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
                    { filter: "cardCategory", value: "character" },
                  ],
                  topOnly: true,
                },
              ],
            },
            finalPosition: "choice",
          },
        ],
      },
    ],
  },
  i18n: op08YouCanTTakeOurKingThisEarlyInTheGame054I18n,
};
