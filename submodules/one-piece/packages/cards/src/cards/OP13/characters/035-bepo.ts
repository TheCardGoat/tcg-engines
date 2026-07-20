import type { CharacterCard } from "@tcg/op-types";
import { op13Bepo035I18n } from "./035-bepo.i18n.ts";

export const op13Bepo035: CharacterCard = {
  id: "OP13-035",
  canonicalId: "OP13-035",
  slug: "bepo/op13-035",
  name: "Bepo",
  printings: [
    {
      id: "OP13-035",
      artId: "OP13-035",
      setCode: "OP13",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-035_hbo71ZB.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 7000,
  traits: ["FILM Heart Pirates Minks"],
  attribute: "strike",
  effect: "[End of Your Turn] Set this Character or up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "setActive",
                  target: {
                    player: "self",
                    zones: ["character"],
                    count: {
                      amount: 1,
                    },
                    self: true,
                  },
                },
              ],
              [
                {
                  action: "setActive",
                  target: {
                    player: "self",
                    zones: ["costArea"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op13Bepo035I18n,
};
