import type { ActionCard } from "@tcg/lorcana-types";
import { doubleTroubleI18n } from "./202-double-trouble.i18n";

export const doubleTrouble: ActionCard = {
  id: "Y2J",
  canonicalId: "ci_Y2J",
  reprints: ["set7-202"],
  cardType: "action",
  name: "Double Trouble",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "007",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b03fcfe1974a4516a5b260cd9cd838b2",
    tcgPlayer: 619524,
  },
  text: "Deal 1 damage each to up to 2 chosen characters.",
  abilities: [
    {
      type: "action",
      text: "Deal 1 damage each to up to 2 chosen characters.",
      effect: {
        amount: 1,
        target: {
          selector: "chosen",
          count: {
            upTo: 2,
          },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
    },
  ],
  i18n: doubleTroubleI18n,
};
