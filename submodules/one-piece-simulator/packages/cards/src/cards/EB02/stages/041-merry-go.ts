import type { StageCard } from "@tcg/op-types";
import { eb02MerryGo041I18n } from "./041-merry-go.i18n.ts";

export const eb02MerryGo041: StageCard = {
  id: "EB02-041",
  cardType: "stage",
  color: ["purple"],
  rarity: "R",
  setId: "EB02",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    '[On Play] If your Leader has the "Straw Hat Crew" type, draw 1 card.\n[Activate: Main] You may rest this Stage: If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, up to 1 of your "Straw Hat Crew" type Characters gains +2 cost until the end of your opponent\'s next turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
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
                  value: "Straw Hat Crew",
                },
              ],
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02MerryGo041I18n,
};
