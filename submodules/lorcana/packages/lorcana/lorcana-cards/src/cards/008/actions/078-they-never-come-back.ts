import type { ActionCard } from "@tcg/lorcana-types";
import { theyNeverComeBackI18n } from "./078-they-never-come-back.i18n";

export const theyNeverComeBack: ActionCard = {
  id: "Ql7",
  canonicalId: "ci_Ql7",
  reprints: ["set8-078"],
  cardType: "action",
  name: "They Never Come Back",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 78,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_2c56f14b54074c8890e8c66d93e1d1f3",
    tcgPlayer: 631694,
  },
  text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            restriction: "cant-ready",
            target: {
              selector: "chosen",
              count: {
                upTo: 2,
              },
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "d6h-1",
      text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
      type: "action",
    },
  ],
  i18n: theyNeverComeBackI18n,
};
