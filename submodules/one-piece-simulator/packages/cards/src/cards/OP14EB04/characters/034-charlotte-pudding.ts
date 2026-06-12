import type { CharacterCard } from "@tcg/op-types";
import { op14eb04CharlottePudding034I18n } from "./034-charlotte-pudding.i18n.ts";

export const op14eb04CharlottePudding034: CharacterCard = {
  id: "EB04-034",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[Blocker]\n[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: If you have 4 or more Events in your trash, up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04CharlottePudding034I18n,
};
