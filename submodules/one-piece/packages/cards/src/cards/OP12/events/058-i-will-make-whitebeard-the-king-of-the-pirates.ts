import type { EventCard } from "@tcg/op-types";
import { op12IWillMakeWhitebeardTheKingOfThePirates058I18n } from "./058-i-will-make-whitebeard-the-king-of-the-pirates.i18n.ts";

export const op12IWillMakeWhitebeardTheKingOfThePirates058: EventCard = {
  id: "OP12-058",
  canonicalId: "OP12-058",
  slug: "i-will-make-whitebeard-the-king-of-the-pirates",
  name: "I Will Make Whitebeard the King of the Pirates",
  printings: [
    {
      id: "OP12-058",
      artId: "OP12-058",
      setCode: "OP12",
      collectorNumber: "058",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-058_bE5ViX9.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 9,
  trigger: "Draw 1 card.",
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] If your Leader\'s type includes "Whitebeard Pirates", reveal 1 card from the top of your deck. If that card is a Character card with a type including "Whitebeard Pirates" and a cost of 9 or less, you may play that card. If you do, that Character gains [Rush] during this turn.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 9,
                },
              ],
              actions: [
                {
                  action: "play",
                  source: {
                    player: "self",
                    zone: "deck",
                  },
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  filters: [
                    {
                      filter: "cardCategory",
                      value: "character",
                    },
                    {
                      filter: "trait",
                      value: "Whitebeard Pirates",
                      match: "includes",
                    },
                    {
                      filter: "cost",
                      comparison: "lte",
                      value: 9,
                    },
                  ],
                  topOnly: true,
                },
                {
                  action: "grantKeyword",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: {
                      amount: 1,
                    },
                  },
                  keyword: "rush",
                  duration: "thisTurn",
                  previousActionTargets: true,
                },
              ],
            },
            finalPosition: "top",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op12IWillMakeWhitebeardTheKingOfThePirates058I18n,
};
