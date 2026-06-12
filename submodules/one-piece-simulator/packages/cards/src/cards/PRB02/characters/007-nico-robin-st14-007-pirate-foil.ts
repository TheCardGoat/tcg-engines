import type { CharacterCard } from "@tcg/op-types";
import { prb02NicoRobinSt14007PirateFoil007I18n } from "./007-nico-robin-st14-007-pirate-foil.i18n.ts";

export const prb02NicoRobinSt14007PirateFoil007: CharacterCard = {
  id: "ST14-007",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST14-007_r1.jpg",
      imageId: "ST14-007_r1",
    },
  ],
  effect:
    "[On Play] / [When Attacking] If you have a Character with a cost of 8 or more, give up to 1 of your opponent's Characters -5 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -5,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -5,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02NicoRobinSt14007PirateFoil007I18n,
};
