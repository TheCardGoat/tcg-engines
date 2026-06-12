import type { ActionCard } from "@tcg/lorcana-types";
import { strikeAGoodMatchI18n } from "./096-strike-a-good-match.i18n";

export const strikeAGoodMatch: ActionCard = {
  id: "Uzr",
  canonicalId: "ci_vCE",
  reprints: ["set3-096", "set11-094"],
  cardType: "action",
  name: "Strike a Good Match",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "003",
  cardNumber: 96,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5423fd35369b41ebbfff99eeb1928fc4",
    tcgPlayer: 674693,
  },
  text: "Draw 2 cards, then choose and discard a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            from: "hand",
            type: "discard",
          },
        ],
      },
    },
  ],
  i18n: strikeAGoodMatchI18n,
};
