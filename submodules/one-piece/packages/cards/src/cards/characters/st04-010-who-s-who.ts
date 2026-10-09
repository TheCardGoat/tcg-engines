import type { CharacterCard } from "@tcg/op-types";
import { st04WhosWho010I18n } from "./st04-010-who-s-who.i18n.ts";

export const st04WhosWho010: CharacterCard = {
  id: "ST04-010",
  canonicalId: "ST04-010",
  slug: "who-s-who/st04-010",
  name: "Who's.Who",
  printings: [
    {
      id: "ST04-010",
      artId: "ST04-010",
      setCode: "ST04",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-010.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 3,
  traits: ["Animal Kingdom Pirates"],
  power: 3000,
  attribute: "slash",
  counter: 0,
  effect:
    "[On Play] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  trigger: "[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st04WhosWho010I18n,
};
