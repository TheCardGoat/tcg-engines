import type { ActionCard } from "@tcg/lorcana-types";
import { distractI18n } from "./159-distract.i18n";

export const distract: ActionCard = {
  id: "qnK",
  canonicalId: "ci_ktc",
  reprints: ["set3-159", "set11-164"],
  cardType: "action",
  name: "Distract",
  inkType: ["sapphire"],
  set: "003",
  cardNumber: 159,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8ca0325f7667410d8b83628e02028294",
    tcgPlayer: 676228,
  },
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: distractI18n,
};
