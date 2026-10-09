import type { CharacterCard } from "@tcg/op-types";
import { st10Heat011I18n } from "./st10-011-heat.i18n.ts";
export const st10Heat011: CharacterCard = {
  id: "ST10-011",
  canonicalId: "ST10-011",
  slug: "heat/st10-011",
  name: "Heat",
  printings: [
    {
      id: "ST10-011",
      artId: "ST10-011",
      setCode: "ST10",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-011.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, this Character gains +2000 power until the start of your next turn.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st10Heat011I18n,
};
