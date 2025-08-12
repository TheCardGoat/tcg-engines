import {
  dealDamageEffect,
  modalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tugofwar: LorcanaActionCardDefinition = {
  id: "r3r",
  name: "Tug-of-War",
  characteristics: ["action"],
  text: "Choose one:<br>• Deal 1 damage to each opposing character without **Evasive**.<br>• Deal 3 damage to each opposing character with **Evasive**.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n• Deal 1 damage to each opposing character without **Evasive**.\n• Deal 3 damage to each opposing character with **Evasive**.",
      effects: [
        modalEffect([
          {
            text: "Deal 1 damage to each opposing character without Evasive.",
            effects: [
              dealDamageEffect({
                targets: [
                  {
                    type: "card",
                    cardType: "character",
                    owner: "opponent",
                    withoutKeyword: "evasive",
                  },
                ],
                value: 1,
              }),
            ],
          },
          {
            text: "Deal 3 damage to each opposing character with Evasive.",
            effects: [
              dealDamageEffect({
                targets: [
                  {
                    type: "card",
                    cardType: "character",
                    owner: "opponent",
                    withKeyword: "evasive",
                  },
                ],
                value: 3,
              }),
            ],
          },
        ]),
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  illustrator: "Maxine Vee",
  number: 196,
  set: "SSK",
  rarity: "rare",
};
