import type { ActionCard } from "@tcg/lorcana-types";
import { butImMuchFasterI18n } from "./195-but-im-much-faster.i18n";

export const butImMuchFaster: ActionCard = {
  id: "BQt",
  canonicalId: "ci_BQt",
  reprints: ["set10-195"],
  cardType: "action",
  name: "But I'm Much Faster",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 195,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_194c57c22f0c46a5a7ec456ac28c7bfa",
    tcgPlayer: 658867,
  },
  text: "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Alert",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
          },
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: butImMuchFasterI18n,
};
