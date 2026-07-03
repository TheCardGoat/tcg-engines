import type { EventCard } from "@tcg/op-types";
import { op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040I18n } from "./040-i-know-you-re-strong-so-i-ll-go-all-out-from-the-very-start.i18n.ts";

export const op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040: EventCard = {
  id: "OP13-040",
  canonicalId: "OP13-040",
  slug: "i-know-you-re-strong-so-i-ll-go-all-out-from-the-very-start",
  name: "I Know You're Strong... So I'll Go All Out from the Very Start!!!",
  printings: [
    {
      id: "OP13-040",
      artId: "OP13-040",
      setCode: "OP13",
      collectorNumber: "040",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-040_DJGa6YR.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  traits: ["Straw Hat Crew Supernovas"],
  effect:
    "[Main] You may rest 2 of your DON!! cards: Up to 2 of your opponent's rested Characters with a cost of 7 or less will not become active in your opponent's next Refresh Phase.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13IKnowYouReStrongSoILlGoAllOutFromTheVeryStart040I18n,
};
