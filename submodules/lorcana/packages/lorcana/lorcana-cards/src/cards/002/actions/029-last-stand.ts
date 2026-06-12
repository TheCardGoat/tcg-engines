import type { ActionCard } from "@tcg/lorcana-types";
import { lastStandI18n } from "./029-last-stand.i18n";

export const lastStand: ActionCard = {
  id: "Eg2",
  canonicalId: "ci_Eg2",
  reprints: ["set2-029"],
  cardType: "action",
  name: "Last Stand",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 29,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a7f5bdc867ac4e5da287d746420e7448",
    tcgPlayer: 520861,
  },
  text: "Banish chosen character who was challenged this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [
            {
              type: "challenged-this-turn",
            },
          ],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
  ],
  i18n: lastStandI18n,
};
