import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Terracotta024I18n } from "./024-terracotta.i18n.ts";

export const op14eb04Terracotta024: CharacterCard = {
  id: "EB04-024",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character and trash 1 card from your hand: Up to 1 of your {Alabasta} type Characters gains [Unblockable] during this turn.(This card cannot be blocked.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Alabasta",
                },
              ],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Terracotta024I18n,
};
