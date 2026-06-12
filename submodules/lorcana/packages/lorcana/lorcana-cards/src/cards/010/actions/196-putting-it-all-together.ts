import type { ActionCard } from "@tcg/lorcana-types";
import { puttingItAllTogetherI18n } from "./196-putting-it-all-together.i18n";

export const puttingItAllTogether: ActionCard = {
  id: "GAi",
  canonicalId: "ci_GAi",
  reprints: ["set10-196"],
  cardType: "action",
  name: "Putting It All Together",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 196,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c1f05cc2e5c4dae84e51404de23df74",
    tcgPlayer: 653912,
  },
  text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "their-next-turn",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
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
      type: "action",
    },
  ],
  i18n: puttingItAllTogetherI18n,
};
