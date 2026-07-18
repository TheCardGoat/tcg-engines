import type { CharacterCard } from "@tcg/op-types";
import { op12Hatchan013I18n } from "./013-hatchan.i18n.ts";

export const op12Hatchan013: CharacterCard = {
  id: "OP12-013",
  canonicalId: "OP12-013",
  slug: "hatchan/op12-013",
  name: "Hatchan",
  printings: [
    {
      id: "OP12-013",
      artId: "OP12-013",
      setCode: "OP12",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-013_GzOHcGM.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man Former Arlong Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character and reveal 2 Events from your hand: Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Hatchan013I18n,
};
