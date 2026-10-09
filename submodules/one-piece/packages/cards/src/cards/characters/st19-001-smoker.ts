import type { CharacterCard } from "@tcg/op-types";
import { st19Smoker001I18n } from "./st19-001-smoker.i18n.ts";
export const st19Smoker001: CharacterCard = {
  id: "ST19-001",
  canonicalId: "ST19-001",
  slug: "smoker/st19-001",
  name: "Smoker",
  printings: [
    {
      id: "ST19-001",
      artId: "ST19-001",
      setCode: "ST19",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST19-001.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST19",
  cost: 6,
  power: 8000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 black {Navy} type card from your hand: Up to 2 of your opponent's Characters with a cost of 4 or less cannot attack until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "trait",
                value: "Navy",
                match: "exact",
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st19Smoker001I18n,
};
