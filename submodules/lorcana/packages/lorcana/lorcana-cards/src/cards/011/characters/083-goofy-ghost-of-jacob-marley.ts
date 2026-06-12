import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGhostOfJacobMarleyI18n } from "./083-goofy-ghost-of-jacob-marley.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const goofyGhostOfJacobMarley: CharacterCard = {
  id: "r4K",
  canonicalId: "ci_r4K",
  reprints: ["set11-083"],
  cardType: "character",
  name: "Goofy",
  version: "Ghost of Jacob Marley",
  inkType: ["emerald"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 83,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6a38f391cffc44ce8c818845eec37f01",
    tcgPlayer: 673328,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "GRAVE OUTCOME",
      description:
        "When this character is banished, each opponent chooses and discards a card for each card that was under him.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost"],
  abilities: [
    boost(2),
    {
      id: "p4g-2",
      effect: {
        amount: {
          type: "trigger-target-attribute",
          attribute: "cards-under-count-before-banish",
        },
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      name: "GRAVE OUTCOME",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "GRAVE OUTCOME When this character is banished, each opponent chooses and discards a card for each card that was under him.",
    },
  ],
  i18n: goofyGhostOfJacobMarleyI18n,
};
