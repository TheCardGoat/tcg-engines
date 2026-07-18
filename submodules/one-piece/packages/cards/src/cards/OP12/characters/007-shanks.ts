import type { CharacterCard } from "@tcg/op-types";
import { op12Shanks007I18n } from "./007-shanks.i18n.ts";

export const op12Shanks007: CharacterCard = {
  id: "OP12-007",
  canonicalId: "OP12-007",
  slug: "shanks/op12-007",
  name: "Shanks",
  printings: [
    {
      id: "OP12-007",
      artId: "OP12-007",
      setCode: "OP12",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-007_Ne1pYCp.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  effect:
    '[On Play] Up to 1 of your Characters with a type including "Roger Pirates" other than [Shanks] gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)',
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
                  filter: "excludeName",
                  value: "Shanks",
                },
                {
                  filter: "trait",
                  value: "Roger Pirates",
                  match: "includes",
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
  i18n: op12Shanks007I18n,
};
