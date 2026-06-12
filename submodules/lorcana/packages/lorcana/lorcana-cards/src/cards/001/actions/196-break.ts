import type { ActionCard } from "@tcg/lorcana-types";
import { breakCardI18n } from "./196-break.i18n";

export const breakCard: ActionCard = {
  id: "PsS",
  canonicalId: "ci_PsS",
  reprints: ["set1-196"],
  cardType: "action",
  name: "Break",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 196,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_327f997026094ec49f0dc7d77e4628f5",
    tcgPlayer: 506000,
  },
  text: "Banish chosen item.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_ITEM",
      },
    },
  ],
  i18n: breakCardI18n,
};
