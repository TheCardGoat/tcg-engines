import type { ActionCard } from "@tcg/lorcana-types";
import { stampedeI18n } from "./096-stampede.i18n";

export const stampede: ActionCard = {
  id: "0r9",
  canonicalId: "ci_0r9",
  reprints: ["set1-096"],
  cardType: "action",
  name: "Stampede",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 96,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c2b11d41ddb1477a8f7293afb674c765",
    tcgPlayer: 505953,
  },
  text: "Deal 2 damage to chosen damaged character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "status",
              status: "damaged",
            },
          ],
        },
      },
    },
  ],
  i18n: stampedeI18n,
};
