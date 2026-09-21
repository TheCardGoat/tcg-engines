import type { CharacterCard } from "@tcg/op-types";
import { op15MonkeyDLuffy092I18n } from "./op15-092-monkey-d-luffy.i18n.ts";

export const op15MonkeyDLuffy092: CharacterCard = {
  id: "OP15-092",
  canonicalId: "OP15-092",
  slug: "monkey-d-luffy/op15-092",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP15-092",
      artId: "OP15-092",
      setCode: "OP15",
      collectorNumber: "092",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-092_wfsrbT6.jpg",
      label: "Monkey.D.Luffy (OP15-092)",
    },
    {
      id: "OP15-092_p1",
      artId: "OP15-092_p1",
      setCode: "OP15",
      collectorNumber: "092",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-092_p1_wvjuF0D.jpg",
      label: "Monkey.D.Luffy (OP15-092) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP15",
  cost: 7,
  power: 7000,
  counter: 1000,
  attribute: "strike",
  traits: ["Straw Hat Crew"],
  effect:
    "Apply each of the following effects based on the number of cards in your trash:\n• If there are 10 or more cards, this Character's base power becomes 9000 and it gains +10 cost.\n• If you have 20 or more cards, during your opponent's turn, your Leader's base power becomes 7000.\n• If you have 30 or more cards, this Character gains +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 9000,
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 10,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 20,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 7000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 30,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15MonkeyDLuffy092I18n,
};
