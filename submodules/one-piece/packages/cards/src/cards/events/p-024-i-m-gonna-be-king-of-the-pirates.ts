import type { EventCard } from "@tcg/op-types";
import { pIMGonnaBeKingOfThePirates024I18n } from "./p-024-i-m-gonna-be-king-of-the-pirates.i18n.ts";
export const pIMGonnaBeKingOfThePirates024: EventCard = {
  id: "P-024",
  canonicalId: "P-024",
  slug: "i-m-gonna-be-king-of-the-pirates/p-024",
  name: "I'm Gonna Be King of the Pirates!!",
  printings: [
    {
      id: "P-024",
      artId: "P-024",
      setCode: "P",
      collectorNumber: "024",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-024.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  traits: ["Supernovas", "Straw Hat Crew"],
  effect: "[Main] Your Leader gains +1000 power for each of your Characters during this turn.",
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 1000,
            valuePerCardGroup: {
              target: {
                player: "self",
                zones: ["character"],
                count: {
                  amount: "all",
                },
              },
              size: 1,
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pIMGonnaBeKingOfThePirates024I18n,
};
