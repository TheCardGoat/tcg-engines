import type { ActionCard } from "@tcg/lorcana-types";
import { hesGotASwordI18n } from "./132-hes-got-a-sword.i18n";

export const hesGotASword: ActionCard = {
  id: "CpS",
  canonicalId: "ci_CpS",
  reprints: ["set1-132"],
  cardType: "action",
  name: "He's Got a Sword!",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 132,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3f328e2a6ea741bcb31348ee2954b3e8",
    tcgPlayer: 508782,
  },
  text: "Chosen character gets +2 {S} this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: hesGotASwordI18n,
};
