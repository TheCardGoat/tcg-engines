import type { CharacterCard } from "@tcg/op-types";
import { op15Margarita091I18n } from "./op15-091-margarita.i18n.ts";

export const op15Margarita091: CharacterCard = {
  id: "OP15-091",
  canonicalId: "OP15-091",
  slug: "margarita/op15-091",
  name: "Margarita",
  printings: [
    {
      id: "OP15-091",
      artId: "OP15-091",
      setCode: "OP15",
      collectorNumber: "091",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-091_4CQZztk.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["The Owner of Cindry's Shadow"],
  attribute: "wisdom",
  effect:
    "[On Play] Place up to 1 card from your opponent's trash at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              chosenBy: "self",
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op15Margarita091I18n,
};
