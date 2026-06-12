import type { CharacterCard } from "@tcg/op-types";
import { op09DocQ090I18n } from "./090-doc-q.i18n.ts";

export const op09DocQ090: CharacterCard = {
  id: "OP09-090",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Blackbeard Pirates" type, K.O. up to 1 of your opponent\'s Characters with a cost of 1 or less.[On K.O.] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09DocQ090I18n,
};
