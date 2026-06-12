import type { CharacterCard } from "@tcg/op-types";
import { op01Sanji013I18n } from "./013-sanji.i18n.ts";

export const op01Sanji013: CharacterCard = {
  id: "OP01-013",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-013_p1.jpg",
      imageId: "OP01-013_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] You may add 1 card from your Life area to your hand: This Character gains +2000 power during this turn. Then, give this Character up to 2 rested DON!! cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01Sanji013I18n,
};
