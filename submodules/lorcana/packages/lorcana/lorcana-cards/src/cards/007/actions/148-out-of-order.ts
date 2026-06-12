import type { ActionCard } from "@tcg/lorcana-types";
import { outOfOrderI18n } from "./148-out-of-order.i18n";

export const outOfOrder: ActionCard = {
  id: "ljS",
  canonicalId: "ci_ljS",
  reprints: ["set7-148"],
  cardType: "action",
  name: "Out of Order",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 148,
  rarity: "common",
  cost: 7,
  inkable: true,
  externalIds: {
    lorcast: "crd_0b939927deb64ca8a8ddde773f6cc340",
    tcgPlayer: 619491,
  },
  text: "Banish chosen character.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "155-1",
      text: "Banish chosen character.",
      type: "action",
    },
  ],
  i18n: outOfOrderI18n,
};
