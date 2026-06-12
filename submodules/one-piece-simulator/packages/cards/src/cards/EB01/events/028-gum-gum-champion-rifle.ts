import type { EventCard } from "@tcg/op-types";
import { eb01GumGumChampionRifle028I18n } from "./028-gum-gum-champion-rifle.i18n.ts";

export const eb01GumGumChampionRifle028: EventCard = {
  id: "EB01-028",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "EB01",
  cost: 1,
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[Counter] If your Leader has the [Impel Down] type, up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, your opponent returns 1 of their active Characters to the owner's hand.[Trigger] Return up to 1 Character with a cost of 3 or less to the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
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
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "state",
                  value: "active",
                },
              ],
              chosenBy: "opponent",
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 3,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb01GumGumChampionRifle028I18n,
};
