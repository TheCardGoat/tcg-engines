import type { ActionCard } from "@tcg/lorcana-types";
import { nothingToHideI18n } from "./165-nothing-to-hide.i18n";

export const nothingToHide: ActionCard = {
  id: "VnI",
  canonicalId: "ci_VnI",
  reprints: ["set2-165"],
  cardType: "action",
  name: "Nothing to Hide",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 165,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e295d49c71554b108a26b197046ca47c",
    tcgPlayer: 526744,
  },
  text: "Each opponent reveals their hand. Draw a card.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "EACH_OPPONENT",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: nothingToHideI18n,
};
