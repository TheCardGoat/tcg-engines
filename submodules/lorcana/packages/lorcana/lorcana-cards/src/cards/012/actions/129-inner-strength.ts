import type { ActionCard } from "@tcg/lorcana-types";
import { innerStrengthI18n } from "./129-inner-strength.i18n";

export const innerStrength: ActionCard = {
  id: "7xf",
  canonicalId: "ci_7xf",
  reprints: ["set12-129"],
  cardType: "action",
  name: "Inner Strength",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 129,
  rarity: "common",
  cost: 1,
  inkable: true,
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  abilities: [
    {
      id: "7xf-1",
      type: "action",
      text: "Chosen character gets +1 {S} this turn. Draw a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          { type: "draw", amount: 1, target: "CONTROLLER" },
        ],
      },
    },
  ],
  i18n: innerStrengthI18n,
};
