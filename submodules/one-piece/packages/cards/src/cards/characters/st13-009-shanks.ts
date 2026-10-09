import type { CharacterCard } from "@tcg/op-types";
import { st13Shanks009I18n } from "./st13-009-shanks.i18n.ts";
export const st13Shanks009: CharacterCard = {
  id: "ST13-009",
  canonicalId: "ST13-009",
  slug: "shanks/st13-009",
  name: "Shanks",
  printings: [
    {
      id: "ST13-009",
      artId: "ST13-009",
      setCode: "ST13",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-009.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 7,
  power: 7000,
  traits: ["The Four Emperors", "Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[On Play] You may turn 1 of your face-up Life cards face-down: If your opponent has 7 or more cards in their hand, trash up to 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "turnLifeFaceUp",
            position: "any",
            count: 1,
            faceUp: false,
          },
        ],
        postCostConditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: st13Shanks009I18n,
};
