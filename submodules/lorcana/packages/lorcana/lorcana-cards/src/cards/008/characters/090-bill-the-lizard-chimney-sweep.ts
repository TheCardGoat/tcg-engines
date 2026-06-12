import type { CharacterCard } from "@tcg/lorcana-types";
import { billTheLizardChimneySweepI18n } from "./090-bill-the-lizard-chimney-sweep.i18n";

export const billTheLizardChimneySweep: CharacterCard = {
  id: "7bC",
  canonicalId: "ci_7bC",
  reprints: ["set8-090"],
  cardType: "character",
  name: "Bill the Lizard",
  version: "Chimney Sweep",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 90,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f76b2615a724413dbb91cdc1b1787b21",
    tcgPlayer: 631847,
  },
  text: [
    {
      title: "NOTHING TO IT",
      description: "While another character in play has damage, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "status",
              status: "damaged",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "tc2-1",
      name: "NOTHING TO IT",
      text: "NOTHING TO IT While another character in play has damage, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: billTheLizardChimneySweepI18n,
};
