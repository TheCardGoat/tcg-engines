import type { CharacterCard } from "@tcg/op-types";
import { op04IceOni047I18n } from "./047-ice-oni.i18n.ts";

export const op04IceOni047: CharacterCard = {
  id: "OP04-047",
  canonicalId: "OP04-047",
  slug: "ice-oni",
  name: "Ice Oni",
  printings: [
    {
      id: "OP04-047",
      artId: "OP04-047",
      setCode: "OP04",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-047.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 8,
  power: 0,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Plague"],
  attribute: "special",
  effect:
    "[Your Turn] At the end of a battle in which this Character battles your opponent's Character with a cost of 5 or less, place the opponent's Character you battled with at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "endOfBattle",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op04IceOni047I18n,
};
