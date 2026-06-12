import type { CharacterCard } from "@tcg/op-types";
import { op10Sanji005I18n } from "./005-sanji.i18n.ts";

export const op10Sanji005: CharacterCard = {
  id: "OP10-005",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP10",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Straw Hat Crew Punk Hazard"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-005_p1.jpg",
      imageId: "OP10-005_p1",
    },
  ],
  effect: "[Your Turn] This Character gains +3000 power.\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10Sanji005I18n,
};
