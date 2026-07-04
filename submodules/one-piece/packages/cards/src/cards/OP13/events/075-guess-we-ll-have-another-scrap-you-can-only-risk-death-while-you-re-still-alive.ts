import type { EventCard } from "@tcg/op-types";
import { op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075I18n } from "./075-guess-we-ll-have-another-scrap-you-can-only-risk-death-while-you-re-still-alive.i18n.ts";

export const op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075: EventCard = {
  id: "OP13-075",
  canonicalId: "OP13-075",
  slug: "guess-we-ll-have-another-scrap-you-can-only-risk-death-while-you-re-still-alive",
  name: "Guess We'll Have Another Scrap. You Can Only Risk Death While You're Still Alive!!",
  printings: [
    {
      id: "OP13-075",
      artId: "OP13-075",
      setCode: "OP13",
      collectorNumber: "075",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-075_6zeTlfR.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  traits: ["Roger Pirates King of the Pirates"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: If your Leader is [Gol.D.Roger] and you have any DON!! cards given, add up to 1 DON!! card from your DON!! deck and rest it.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Gol.D.Roger",
              },
              {
                condition: "donGiven",
                player: "self",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
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
  i18n: op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075I18n,
};
