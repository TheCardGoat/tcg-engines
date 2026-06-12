import type { ActionCard } from "@tcg/lorcana-types";
import { ifItsNotBaroqueI18n } from "./162-if-its-not-baroque.i18n";

export const ifItsNotBaroque: ActionCard = {
  id: "wfG",
  canonicalId: "ci_wfG",
  reprints: ["set1-162"],
  cardType: "action",
  name: "If it’s Not Baroque",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 162,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_fcfc387c36dc450c93bb85840e3b6957",
    tcgPlayer: 505980,
  },
  text: "Return an item card from your discard to your hand.",
  abilities: [
    {
      type: "action",
      effect: {
        cardType: "item",
        target: "CONTROLLER",
        type: "return-from-discard",
      },
    },
  ],
  i18n: ifItsNotBaroqueI18n,
};
