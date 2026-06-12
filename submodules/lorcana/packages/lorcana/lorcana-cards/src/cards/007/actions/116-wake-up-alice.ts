import type { ActionCard } from "@tcg/lorcana-types";
import { wakeUpAliceI18n } from "./116-wake-up-alice.i18n";

export const wakeUpAlice: ActionCard = {
  id: "LkF",
  canonicalId: "ci_LkF",
  reprints: ["set7-116"],
  cardType: "action",
  name: "Wake Up, Alice!",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 116,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_688f773c54e34dbf8f96096b19c1c2b9",
    tcgPlayer: 618258,
  },
  text: "Return chosen damaged character to their player's hand.",
  abilities: [
    {
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
        type: "return-to-hand",
      },
      id: "7tg-1",
      text: "Return chosen damaged character to their player's hand.",
      type: "action",
    },
  ],
  i18n: wakeUpAliceI18n,
};
