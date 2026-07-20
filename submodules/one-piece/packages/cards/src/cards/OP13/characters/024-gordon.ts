import type { CharacterCard } from "@tcg/op-types";
import { op13Gordon024I18n } from "./024-gordon.i18n.ts";

export const op13Gordon024: CharacterCard = {
  id: "OP13-024",
  canonicalId: "OP13-024",
  slug: "gordon/op13-024",
  name: "Gordon",
  printings: [
    {
      id: "OP13-024",
      artId: "OP13-024",
      setCode: "OP13",
      collectorNumber: "024",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-024_gyMopd2.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["FILM"],
  attribute: "wisdom",
  effect:
    '[On Play] You may reveal 1 "Music" or "FILM" type card from your hand: Set up to 2 of your DON!! cards as active at the end of this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 1,
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Music",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "FILM",
                    match: "includes",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "delayed",
            timing: "endOfThisTurn",
            actions: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["costArea"],
                  count: {
                    amount: 2,
                    upTo: true,
                  },
                },
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13Gordon024I18n,
};
