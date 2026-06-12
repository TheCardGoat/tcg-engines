import type { ActionCard } from "@tcg/lorcana-types";
import { ghostlyTaleI18n } from "./132-ghostly-tale.i18n";

export const ghostlyTale: ActionCard = {
  id: "nOf",
  canonicalId: "ci_nOf",
  reprints: ["set10-132"],
  cardType: "action",
  name: "Ghostly Tale",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 132,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_7724545f54ee47aaadb5ea5aee9cd92e",
    tcgPlayer: 660016,
  },
  text: "Exert all opposing characters with 2 {S} or less.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        type: "exert",
      },
      type: "action",
    },
  ],
  i18n: ghostlyTaleI18n,
};
