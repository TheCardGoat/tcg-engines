import type { ActionCard } from "@tcg/lorcana-types";
import { ringTheBellI18n } from "./101-ring-the-bell.i18n";

export const ringTheBell: ActionCard = {
  id: "9sx",
  canonicalId: "ci_9sx",
  reprints: ["set2-101"],
  cardType: "action",
  name: "Ring the Bell",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 101,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_50bb3e4e83fa4e7d9e603a15bc296c3e",
    tcgPlayer: 525266,
  },
  text: "Banish chosen damaged character.",
  abilities: [
    {
      type: "action",
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [
            {
              type: "damaged",
            },
          ],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
    },
  ],
  i18n: ringTheBellI18n,
};
