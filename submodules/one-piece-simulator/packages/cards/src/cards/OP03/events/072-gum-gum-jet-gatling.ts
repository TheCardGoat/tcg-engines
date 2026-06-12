import type { EventCard } from "@tcg/op-types";
import { op03GumGumJetGatling072I18n } from "./072-gum-gum-jet-gatling.i18n.ts";

export const op03GumGumJetGatling072: EventCard = {
  id: "OP03-072",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP03",
  cost: 0,
  traits: ["Straw Hat Crew Water Seven"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op03GumGumJetGatling072I18n,
};
