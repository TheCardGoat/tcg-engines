import type { CharacterCard } from "@tcg/op-types";
import { st15Atmos001I18n } from "./st15-001-atmos.i18n.ts";
export const st15Atmos001: CharacterCard = {
  id: "ST15-001",
  canonicalId: "ST15-001",
  slug: "atmos/st15-001",
  name: "Atmos",
  printings: [
    {
      id: "ST15-001",
      artId: "ST15-001",
      setCode: "ST15",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST15-001.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST15",
  cost: 4,
  traits: ["Whitebeard Pirates"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[When Attacking] If your Leader is [Edward.Newgate], you cannot add Life cards to your hand using your own effects during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "leaderName",
            name: "Edward.Newgate",
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
            },
            duration: "thisTurn",
            bySource: "ownEffect",
          },
        ],
      },
    ],
  },
  i18n: st15Atmos001I18n,
};
