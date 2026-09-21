import type { CharacterCard } from "@tcg/op-types";
import { op05OneLeggedToySoldier081I18n } from "./op05-081-one-legged-toy-soldier.i18n.ts";

export const op05OneLeggedToySoldier081: CharacterCard = {
  id: "OP05-081",
  canonicalId: "OP05-081",
  slug: "one-legged-toy-soldier",
  name: "One-Legged Toy Soldier",
  printings: [
    {
      id: "OP05-081",
      artId: "OP05-081",
      setCode: "OP05",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081.jpg",
    },
    {
      id: "OP05-081_p2",
      artId: "OP05-081_p2",
      setCode: "OP05",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p2.jpg",
    },
    {
      id: "OP05-081_p3",
      artId: "OP05-081_p3",
      setCode: "OP05",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p3.jpg",
      label: "One-Legged Toy Soldier (Full Art)",
    },
    {
      id: "OP05-081_p4",
      artId: "OP05-081_p4",
      setCode: "OP05",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_p4.jpg",
      label: "One-Legged Toy Soldier (Alternate Art)",
    },
    {
      id: "OP05-081_r1",
      artId: "OP05-081_r1",
      setCode: "OP05",
      collectorNumber: "081",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-081_r1.jpg",
      label: "One-Legged Toy Soldier (Reprint)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Dressrosa"],
  attribute: "strike",
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
  i18n: op05OneLeggedToySoldier081I18n,
};
