import type { ActionCard } from "@tcg/lorcana-types";
import { makingMagicI18n } from "./062-making-magic.i18n";

export const makingMagic: ActionCard = {
  id: "sXO",
  canonicalId: "ci_sXO",
  reprints: ["set6-062"],
  cardType: "action",
  name: "Making Magic",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 62,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_9bc0e3add087485a927ee66c7414802d",
    tcgPlayer: 593024,
  },
  text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
  abilities: [
    {
      id: "1ci-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-damage",
            amount: 1,
            from: "CHOSEN_CHARACTER",
            to: "CHOSEN_OPPOSING_CHARACTER",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
      type: "action",
      text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
    },
  ],
  i18n: makingMagicI18n,
};
