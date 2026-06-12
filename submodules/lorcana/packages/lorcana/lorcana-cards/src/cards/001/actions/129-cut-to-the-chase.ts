import type { ActionCard } from "@tcg/lorcana-types";
import { cutToTheChaseI18n } from "./129-cut-to-the-chase.i18n";

export const cutToTheChase: ActionCard = {
  id: "VLl",
  canonicalId: "ci_VLl",
  reprints: ["set1-129"],
  cardType: "action",
  name: "Cut to the Chase",
  inkType: ["ruby"],
  set: "001",
  cardNumber: 129,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_df33509235464d18becdd63bd8ce91eb",
    tcgPlayer: 508615,
  },
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
    },
  ],
  i18n: cutToTheChaseI18n,
};
