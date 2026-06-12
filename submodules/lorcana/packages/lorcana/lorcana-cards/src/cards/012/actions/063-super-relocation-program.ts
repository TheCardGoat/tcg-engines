import type { ActionCard } from "@tcg/lorcana-types";
import { superRelocationProgramI18n } from "./063-super-relocation-program.i18n";

export const superRelocationProgram: ActionCard = {
  id: "Rxt",
  canonicalId: "ci_Rxt",
  reprints: ["set12-063"],
  cardType: "action",
  name: "Super Relocation Program",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 63,
  rarity: "common",
  cost: 4,
  inkable: true,
  text: "Return chosen character of yours to your hand. If you returned a Hero character this way, draw 2 cards.",
  abilities: [
    {
      id: "Rxt-1",
      type: "action",
      text: "Return chosen character of yours to your hand. If you returned a Hero character this way, draw 2 cards.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                { type: "if-you-do" },
                { type: "returned-card-has-classification", classification: "Hero" },
              ],
            },
            then: { type: "draw", amount: 2, target: "CONTROLLER" },
          },
        ],
      },
    },
  ],
  i18n: superRelocationProgramI18n,
};
