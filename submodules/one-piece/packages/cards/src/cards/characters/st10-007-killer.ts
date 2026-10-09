import type { CharacterCard } from "@tcg/op-types";
import { st10Killer007I18n } from "./st10-007-killer.i18n.ts";
export const st10Killer007: CharacterCard = {
  id: "ST10-007",
  canonicalId: "ST10-007",
  slug: "killer/st10-007",
  name: "Killer",
  printings: [
    {
      id: "ST10-007",
      artId: "ST10-007",
      setCode: "ST10",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-007.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st10Killer007I18n,
};
