import type { CharacterCard } from "@tcg/op-types";
import { op08MontBlancNoland109I18n } from "./109-mont-blanc-noland.i18n.ts";

export const op08MontBlancNoland109: CharacterCard = {
  id: "OP08-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Jaya Botanist"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [Shandian Warrior] type and you have a [Kalgara] Character, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Shandian Warrior",
              },
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "Kalgara",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op08MontBlancNoland109I18n,
};
