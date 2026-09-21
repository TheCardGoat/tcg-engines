import type { CharacterCard } from "@tcg/op-types";
import { prb01MonkeyDLuffyP055JollyRogerFoil055I18n } from "./p-055-monkey-d-luffy-p-055-jolly-roger-foil.i18n.ts";

export const prb01MonkeyDLuffyP055JollyRogerFoil055: CharacterCard = {
  id: "P-055",
  canonicalId: "P-055",
  slug: "monkey-d-luffy-p-055-jolly-roger-foil",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-055",
      artId: "P-055",
      setCode: "P",
      collectorNumber: "055",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-055_p2.jpg",
      label: "Monkey.D.Luffy (P-055) (Jolly Roger Foil)",
    },
    {
      id: "P-055_p3",
      artId: "P-055_p3",
      setCode: "P",
      collectorNumber: "055",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-055_p3.jpg",
      label: "Monkey.D.Luffy (P-055) (Full Art)",
    },
    {
      id: "P-055_r1",
      artId: "P-055_r1",
      setCode: "P",
      collectorNumber: "055",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-055_r1.jpg",
      label: "Monkey.D.Luffy (P-055) (Reprint)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 2 cards from your hand: Your opponent places 1 of their Characters at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
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
              chosenBy: "opponent",
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01MonkeyDLuffyP055JollyRogerFoil055I18n,
};
