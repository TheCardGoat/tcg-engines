import type { ActionCard } from "@tcg/lorcana-types";
import { duckForCoverI18n } from "./198-duck-for-cover.i18n";

export const duckForCover: ActionCard = {
  id: "WBj",
  canonicalId: "ci_WBj",
  reprints: ["set5-198"],
  cardType: "action",
  name: "Duck for Cover!",
  inkType: ["steel"],
  set: "005",
  cardNumber: 198,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2eae8238f1d54959a3bc9f1e875c1efe",
    tcgPlayer: 561850,
  },
  text: "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            duration: "this-turn",
            keyword: "Resist",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 1,
          },
          {
            duration: "this-turn",
            keyword: "Evasive",
            target: {
              ref: "previous-target",
            },
            type: "gain-keyword",
          },
        ],
      },
      id: "13l-1",
      text: "Chosen character gains Resist +1 and Evasive this turn.",
      type: "action",
    },
  ],
  i18n: duckForCoverI18n,
};
