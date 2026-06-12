import type { ActionCard } from "@tcg/lorcana-types";
import { nanisPaybackI18n } from "./127-nanis-payback.i18n";

export const nanisPayback: ActionCard = {
  id: "9Vx",
  canonicalId: "ci_9Vx",
  reprints: ["set11-127"],
  cardType: "action",
  name: "Nani's Payback",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 127,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_ade83b5dd75144a4b901097e22b7b8b1",
    tcgPlayer: 676215,
  },
  text: "Each opponent loses lore equal to the damage on chosen character of yours, to a maximum of 4 lore each. Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        steps: [
          {
            counter: {
              type: "damage-on-target",
            },
            effect: {
              amount: 1,
              target: "EACH_OPPONENT",
              type: "lose-lore",
            },
            maximum: 4,
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "for-each",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
    },
  ],
  i18n: nanisPaybackI18n,
};
