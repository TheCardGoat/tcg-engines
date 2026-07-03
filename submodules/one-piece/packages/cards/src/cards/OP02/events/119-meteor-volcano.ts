import type { EventCard } from "@tcg/op-types";
import { op02MeteorVolcano119I18n } from "./119-meteor-volcano.i18n.ts";

export const op02MeteorVolcano119: EventCard = {
  id: "OP02-119",
  canonicalId: "OP02-119",
  slug: "meteor-volcano",
  name: "Meteor Volcano",
  printings: [
    {
      id: "OP02-119",
      artId: "OP02-119",
      setCode: "OP02",
      collectorNumber: "119",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-119.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  traits: ["Navy"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 1 or less. [Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
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
  i18n: op02MeteorVolcano119I18n,
};
