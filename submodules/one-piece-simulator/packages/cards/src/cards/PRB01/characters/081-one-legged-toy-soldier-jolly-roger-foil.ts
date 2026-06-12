import type { CharacterCard } from "@tcg/op-types";
import { prb01OneLeggedToySoldierJollyRogerFoil081I18n } from "./081-one-legged-toy-soldier-jolly-roger-foil.i18n.ts";

export const prb01OneLeggedToySoldierJollyRogerFoil081: CharacterCard = {
  id: "OP05-081",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB01",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_r1.jpg",
      imageId: "OP05-081_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p3.jpg",
      imageId: "OP05-081_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p4.jpg",
      imageId: "OP05-081_p4",
    },
  ],
  effect:
    "[Activate:Main] You may trash this Character: Give up to 1 of your opponent's Characters -3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
            value: -3,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01OneLeggedToySoldierJollyRogerFoil081I18n,
};
