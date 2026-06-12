import type { CharacterCard } from "@tcg/op-types";
import { eb02FakeStrawHatCrew005I18n } from "./005-fake-straw-hat-crew.i18n.ts";

export const eb02FakeStrawHatCrew005: CharacterCard = {
  id: "EB02-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  power: 3000,
  traits: ["Fake Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[Your Turn] This Character gains +2000 power.\n[Opponent's Turn] Give this Character 2000 power.",
  effects: {
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb02FakeStrawHatCrew005I18n,
};
