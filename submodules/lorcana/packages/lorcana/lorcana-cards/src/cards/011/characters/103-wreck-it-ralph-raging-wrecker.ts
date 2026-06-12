import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphRagingWreckerI18n } from "./103-wreck-it-ralph-raging-wrecker.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const wreckitRalphRagingWrecker: CharacterCard = {
  id: "C0z",
  canonicalId: "ci_C0z",
  reprints: ["set11-103"],
  cardType: "character",
  name: "Wreck-it Ralph",
  version: "Raging Wrecker",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "011",
  cardNumber: 103,
  rarity: "legendary",
  cost: 7,
  strength: 3,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_cb5f4cea3a664d12952b12a0a30fbbf3",
    tcgPlayer: 675344,
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "POWERED UP",
      description: "This character gets +1 {S} for each card under him.",
    },
    {
      title: "WHO'S COMIN' WITH ME?",
      description:
        "When this character is banished, banish all characters with {S} equal to or less than the {S} he had in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
  abilities: [
    boost(1),
    {
      id: "2cc-2",
      name: "POWERED UP",
      type: "static",
      effect: {
        type: "modify-stat",
        target: "SELF",
        stat: "strength",
        modifier: {
          type: "cards-under-self",
        },
      },
      text: "POWERED UP This character gets +1 {S} for each card under him.",
    },
    {
      id: "2cc-3",
      name: "WHO'S COMIN' WITH ME?",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: "source",
            },
          ],
        },
      },
      text: "WHO'S COMIN' WITH ME? When this character is banished, banish all characters with {S} equal to or less than the {S} he had in play.",
    },
  ],
  i18n: wreckitRalphRagingWreckerI18n,
};
