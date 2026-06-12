import type { ActionCard } from "@tcg/lorcana-types";
import { bendToMyWillI18n } from "./093-bend-to-my-will.i18n";

export const bendToMyWill: ActionCard = {
  id: "7l9",
  canonicalId: "ci_7l9",
  reprints: ["set6-093"],
  cardType: "action",
  name: "Bend to My Will",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 93,
  rarity: "common",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_5406218b8d7a41a68bdf0be3029acf05",
    tcgPlayer: 591980,
  },
  text: "Each opponent discards all cards in their hand.",
  abilities: [
    {
      type: "action",
      text: "Each opponent discards all cards in their hand.",
      effect: {
        type: "discard",
        amount: "all",
        from: "hand",
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: bendToMyWillI18n,
};
