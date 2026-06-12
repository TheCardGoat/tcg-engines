import type { ActionCard } from "@tcg/lorcana-types";
import { someoneWillLoseHisHeadI18n } from "./162-someone-will-lose-his-head.i18n";

export const someoneWillLoseHisHead: ActionCard = {
  id: "20z",
  canonicalId: "ci_20z",
  reprints: ["set12-162"],
  cardType: "action",
  name: "Someone Will Lose His Head",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "012",
  cardNumber: 162,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6e75e30d325452bba95859c5d667442",
  },
  text: "Each opposing character gets -2 {S} this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "this-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: someoneWillLoseHisHeadI18n,
};
