import type { CharacterCard } from "@tcg/op-types";
import { st10EustassCaptainKid013I18n } from "./st10-013-eustass-captain-kid.i18n.ts";
export const st10EustassCaptainKid013: CharacterCard = {
  id: "ST10-013",
  canonicalId: "ST10-013",
  slug: "eustass-captain-kid/st10-013",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "ST10-013",
      artId: "ST10-013",
      setCode: "ST10",
      collectorNumber: "013",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-013.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST10",
  cost: 7,
  power: 8000,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    "[On Play]/[When Attacking] DON!! \u22121 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader gains +1000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                upTo: true,
              },
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
        optional: true,
      },
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
                upTo: true,
              },
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st10EustassCaptainKid013I18n,
};
