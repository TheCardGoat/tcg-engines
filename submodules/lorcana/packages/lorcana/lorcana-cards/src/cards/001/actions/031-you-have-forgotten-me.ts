import type { ActionCard } from "@tcg/lorcana-types";
import { youHaveForgottenMeI18n } from "./031-you-have-forgotten-me.i18n";

export const youHaveForgottenMe: ActionCard = {
  id: "3p5",
  canonicalId: "ci_7me",
  reprints: ["set1-031"],
  cardType: "action",
  name: "You Have Forgotten Me",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 31,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_c91b8810b881450faa5942daf03e03ef",
    tcgPlayer: 508716,
  },
  text: "Each opponent chooses and discards 2 cards.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 2,
        chosen: true,
        from: "hand",
        target: "EACH_OPPONENT",
        type: "discard",
      },
    },
  ],
  i18n: youHaveForgottenMeI18n,
};
