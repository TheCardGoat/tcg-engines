import type { ActionCard } from "@tcg/lorcana-types";
import { strikeAGoodMatchI18n } from "./094-strike-a-good-match.i18n";

export const strikeAGoodMatch: ActionCard = {
  id: "9gi",
  canonicalId: "ci_vCE",
  slug: "lorcana-ci_vCE",
  printings: [
    {
      id: "set11-094",
      artId: "set11-094",
      setCode: "set11",
      collectorNumber: "94",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-096", "set11-094"],
  cardType: "action",
  name: "Strike A Good Match",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 94,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5423fd35369b41ebbfff99eeb1928fc4",
    tcgPlayer: "674693",
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
