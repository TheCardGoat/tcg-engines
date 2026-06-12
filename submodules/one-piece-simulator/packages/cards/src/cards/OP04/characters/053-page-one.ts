import type { CharacterCard } from "@tcg/op-types";
import { op04PageOne053I18n } from "./053-page-one.i18n.ts";

export const op04PageOne053: CharacterCard = {
  id: "OP04-053",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 4,
  power: 6000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] [Once Per Turn] When you activate an Event, draw 1 card. Then, place 1 card from your hand at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenYouActivateEvent",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04PageOne053I18n,
};
