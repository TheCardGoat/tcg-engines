import type { CharacterCard } from "@tcg/lorcana-types";
import { helgaSinclairPreparedForAnythingI18n } from "./093-helga-sinclair-prepared-for-anything.i18n";

export const helgaSinclairPreparedForAnything: CharacterCard = {
  id: "1kF",
  canonicalId: "ci_1kF",
  reprints: ["set12-093"],
  cardType: "character",
  name: "Helga Sinclair",
  version: "Prepared for Anything",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 93,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ad9b6e3372a140178662bc5ffd0db287",
  },
  text: [
    {
      title: "COMBAT TRAINING",
      description:
        "Whenever this character quests, deal 1 damage to chosen opposing character. If 2 or more cards were put into your discard this turn, deal 2 damage instead.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "1kF-1",
      name: "COMBAT TRAINING",
      type: "triggered",
      text: "COMBAT TRAINING Whenever this character quests, deal 1 damage to chosen opposing character. If 2 or more cards were put into your discard this turn, deal 2 damage instead.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_OPPOSING_CHARACTER",
        selfReplacement: {
          condition: {
            type: "condition",
            condition: {
              type: "turn-metric",
              metric: "discard-cards-entered",
              ownerScope: "you",
              comparison: {
                operator: "gte",
                value: 2,
              },
            },
          },
          value: 2,
        },
      },
    },
  ],
  i18n: helgaSinclairPreparedForAnythingI18n,
};
