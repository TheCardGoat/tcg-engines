import type { EventCard } from "@tcg/op-types";
import { op15GoAheadAndUseEmMrLuffy055I18n } from "./op15-055-go-ahead-and-use-em-mr-luffy.i18n.ts";

export const op15GoAheadAndUseEmMrLuffy055: EventCard = {
  id: "OP15-055",
  canonicalId: "OP15-055",
  slug: "go-ahead-and-use-em-mr-luffy/op15-055",
  name: "Go Ahead and Use 'Em, Mr. Luffy!!!",
  printings: [
    {
      id: "OP15-055",
      artId: "OP15-055",
      setCode: "OP15",
      collectorNumber: "055",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-055_iMV74yV.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP15",
  cost: 3,
  traits: ["Dressrosa Barto Club"],
  effect:
    "[Main] Choose one:\n• Draw 2 cards.\n• Up to 1 of your {Dressrosa} type Characters gains [Blocker] until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
              ],
              [
                {
                  action: "grantKeyword",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "trait",
                        value: "Dressrosa",
                        match: "includes",
                      },
                    ],
                  },
                  keyword: "blocker",
                  duration: "untilEndOfOpponentNextEndPhase",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op15GoAheadAndUseEmMrLuffy055I18n,
};
