import type { ActionCard } from "@tcg/lorcana-types";
import { metamorphosisI18n } from "./031-metamorphosis.i18n";

export const metamorphosis: ActionCard = {
  id: "hlG",
  canonicalId: "ci_hlG",
  reprints: ["set12-031"],
  cardType: "action",
  name: "Metamorphosis",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 31,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_bd6859c3955c47818b6c6df4df09bc69",
  },
  text: "Shift a character from your discard for free.",
  abilities: [
    {
      type: "action",
      text: "Play a character with Shift from your discard for free.",
      effect: {
        type: "play-card",
        cardType: "character",
        cost: "free",
        from: "discard",
        playMethod: "shift",
        filter: [
          {
            type: "has-keyword",
            keyword: "Shift",
          },
        ],
      },
    },
  ],
  i18n: metamorphosisI18n,
};
