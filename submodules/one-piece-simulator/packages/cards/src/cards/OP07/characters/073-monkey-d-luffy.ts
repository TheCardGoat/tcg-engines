import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy073I18n } from "./073-monkey-d-luffy.i18n.ts";

export const op07MonkeyDLuffy073: CharacterCard = {
  id: "OP07-073",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP07",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Activate: Main][Once Per Turn] DON!! -3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your opponent has 3 or more Characters, set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "character",
            comparison: "gte",
            value: 3,
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07MonkeyDLuffy073I18n,
};
