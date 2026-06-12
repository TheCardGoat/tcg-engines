import type { EventCard } from "@tcg/op-types";
import { op09GumGumGiant078I18n } from "./078-gum-gum-giant.i18n.ts";

export const op09GumGumGiant078: EventCard = {
  id: "OP09-078",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  traits: ["Straw Hat Crew The Four Emperors"],
  effect:
    '[Counter] DON!! 2, You may trash 1 card from your hand: If your Leader has the "Straw Hat Crew" type, up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, draw 2 cards.',
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09GumGumGiant078I18n,
};
