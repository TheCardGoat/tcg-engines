import type { CharacterCard } from "@tcg/lorcana-types";
import { windupFrogSidsToyI18n } from "./112-wind-up-frog-sids-toy.i18n";

export const windupFrogSidsToy: CharacterCard = {
  id: "ZJM",
  canonicalId: "ci_ZJM",
  reprints: ["set12-112"],
  cardType: "character",
  name: "Wind-Up Frog",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 112,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Added Traction",
      description:
        "If one of your Toy characters was banished this turn, you pay 2 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "ZJM-1",
      name: "Added Traction",
      type: "static",
      text: "Added Traction If one of your Toy characters was banished this turn, you pay 2 {I} less to play this character.",
      sourceZones: ["hand"],
      condition: {
        type: "turn-metric",
        metric: "banished-characters",
        ownerScope: "you",
        classification: "Toy",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
        cardType: "character",
      },
    },
  ],
  i18n: windupFrogSidsToyI18n,
};
