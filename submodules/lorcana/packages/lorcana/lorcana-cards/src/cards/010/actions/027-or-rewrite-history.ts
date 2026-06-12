import type { ActionCard } from "@tcg/lorcana-types";
import { orRewriteHistoryI18n } from "./027-or-rewrite-history.i18n";

export const orRewriteHistory: ActionCard = {
  id: "ZSz",
  canonicalId: "ci_ZSz",
  reprints: ["set10-027"],
  cardType: "action",
  name: "Or Rewrite History!",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 27,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a6fe0f1466334c1abc4a7cda49a6db08",
    tcgPlayer: 659463,
  },
  text: "Return a character card from your discard to your hand.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        cardType: "character",
        destination: "hand",
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      type: "action",
    },
  ],
  i18n: orRewriteHistoryI18n,
};
