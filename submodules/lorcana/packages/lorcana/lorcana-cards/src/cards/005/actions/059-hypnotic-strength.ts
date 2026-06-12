import type { ActionCard } from "@tcg/lorcana-types";
import { hypnoticStrengthI18n } from "./059-hypnotic-strength.i18n";

export const hypnoticStrength: ActionCard = {
  id: "ZhD",
  canonicalId: "ci_ZhD",
  reprints: ["set5-059"],
  cardType: "action",
  name: "Hypnotic Strength",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 59,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9444cd2552124a658a0c276513934a4f",
    tcgPlayer: 561345,
  },
  text: "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      id: "tu0-1",
      text: "Draw a card. Chosen character gains Challenger +2 this turn.",
      type: "action",
    },
  ],
  i18n: hypnoticStrengthI18n,
};
