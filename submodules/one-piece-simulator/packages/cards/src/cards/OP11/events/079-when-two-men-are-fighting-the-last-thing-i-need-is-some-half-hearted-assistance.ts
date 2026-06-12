import type { EventCard } from "@tcg/op-types";
import { op11WhenTwoMenAreFightingTheLastThingINeedIsSomeHalfHeartedAssistance079I18n } from "./079-when-two-men-are-fighting-the-last-thing-i-need-is-some-half-hearted-assistance.i18n.ts";

export const op11WhenTwoMenAreFightingTheLastThingINeedIsSomeHalfHeartedAssistance079: EventCard = {
  id: "OP11-079",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["Big Mom Pirates"],
  effect:
    "[Counter] Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, up to 1 of your Leader or Character cards gains +5000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 5000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op11WhenTwoMenAreFightingTheLastThingINeedIsSomeHalfHeartedAssistance079I18n,
};
