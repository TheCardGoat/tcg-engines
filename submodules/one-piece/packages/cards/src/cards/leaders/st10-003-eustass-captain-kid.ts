import type { LeaderCard } from "@tcg/op-types";
import { st10EustassCaptainKid003I18n } from "./st10-003-eustass-captain-kid.i18n.ts";
export const st10EustassCaptainKid003: LeaderCard = {
  id: "ST10-003",
  canonicalId: "ST10-003",
  slug: "eustass-captain-kid/st10-003",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "ST10-003",
      artId: "ST10-003",
      setCode: "ST10",
      collectorNumber: "003",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-003.png",
    },
  ],
  cardType: "leader",
  color: ["red", "purple"],
  rarity: "L",
  setId: "ST10",
  power: 5000,
  life: 5,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] If you have 4 or more Life cards, give this Leader \u22121000 power. [When Attacking] DON!! \u22121 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Leader gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "gte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: "all",
              },
              self: true,
            },
            value: -1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st10EustassCaptainKid003I18n,
};
