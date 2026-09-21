import type { EventCard } from "@tcg/op-types";
import { eb04GumGumHawkGatling060I18n } from "./eb04-060-gum-gum-hawk-gatling.i18n.ts";

export const eb04GumGumHawkGatling060: EventCard = {
  id: "EB04-060",
  canonicalId: "EB04-060",
  slug: "gum-gum-hawk-gatling/eb04-060",
  name: "Gum-Gum Hawk Gatling",
  printings: [
    {
      id: "EB04-060",
      artId: "EB04-060",
      setCode: "EB04",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-060_HhzAaHv.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 2,
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  effect:
    "[Main] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 {Egghead} type Character card from your hand to the top of your Life cards face-up. Then, give up to 1 of your opponent's Characters -1000 power during this turn.[Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Egghead",
                  match: "includes",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
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
  i18n: eb04GumGumHawkGatling060I18n,
};
