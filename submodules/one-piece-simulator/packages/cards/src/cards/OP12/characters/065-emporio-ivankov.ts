import type { CharacterCard } from "@tcg/op-types";
import { op12EmporioIvankov065I18n } from "./065-emporio-ivankov.i18n.ts";

export const op12EmporioIvankov065: CharacterCard = {
  id: "OP12-065",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "special",
  effect:
    "If you have 4 or more Events in your trash, this Character gains [Blocker].\n[On K.O.] Add up to 1 Event from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12EmporioIvankov065I18n,
};
