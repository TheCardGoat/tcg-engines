import type { EventCard } from "@tcg/op-types";
import { st06GreatEruption015I18n } from "./st06-015-great-eruption.i18n.ts";
export const st06GreatEruption015: EventCard = {
  id: "ST06-015",
  canonicalId: "ST06-015",
  slug: "great-eruption/st06-015",
  name: "Great Eruption",
  printings: [
    {
      id: "ST06-015",
      artId: "ST06-015",
      setCode: "ST06",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-015.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Main] Draw 1 card. Then, give up to 1 of your opponent's Characters −2 cost during this turn.",
  trigger: "Your opponent chooses 1 card from their hand and trashes it.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st06GreatEruption015I18n,
};
