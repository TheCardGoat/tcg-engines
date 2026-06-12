import type { EventCard } from "@tcg/op-types";
import { eb01DidSomeoneSayKami060I18n } from "./060-did-someone-say-kami.i18n.ts";

export const eb01DidSomeoneSayKami060: EventCard = {
  id: "EB01-060",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "EB01",
  cost: 4,
  traits: ["Sky Island"],
  effect:
    "[Main] Play up to 1 [Enel] with a cost of 7 or less life from your hand or trash. Then, trash cards from the top of your Life cards until you have 1 Life card. [Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Enel",
              },
            ],
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb01DidSomeoneSayKami060I18n,
};
