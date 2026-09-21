import type { CharacterCard } from "@tcg/op-types";
import { op17InuarashiNekomamushi004I18n } from "./op17-004-inuarashi-nekomamushi.i18n.ts";

export const op17InuarashiNekomamushi004: CharacterCard = {
  id: "OP17-004",
  canonicalId: "OP17-004",
  slug: "inuarashi-nekomamushi/op17-004",
  name: "Inuarashi & Nekomamushi",
  printings: [
    {
      id: "OP17-004",
      artId: "OP17-004",
      setCode: "OP17",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-004.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["Land of Wano Minks Whitebeard Pirates"],
  attribute: "slash",
  effect:
    '[On Play] Up to 1 of your {Land of Wano} type Characters or up to 1 of your Characters with a type including "Whitebeard Pirates" gains [Rush] during this turn. (This card can attack on the turn in which it is played.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                  filter: "anyOf",
                  groups: [
                    [
                      {
                        filter: "trait",
                        value: "Land of Wano",
                        match: "includes",
                      },
                    ],
                    [
                      {
                        filter: "trait",
                        value: "Whitebeard Pirates",
                        match: "includes",
                      },
                    ],
                  ],
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op17InuarashiNekomamushi004I18n,
};
