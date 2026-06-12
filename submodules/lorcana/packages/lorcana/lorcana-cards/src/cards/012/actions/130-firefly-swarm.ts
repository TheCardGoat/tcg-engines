import type { ActionCard } from "@tcg/lorcana-types";
import { fireflySwarmI18n } from "./130-firefly-swarm.i18n";

export const fireflySwarm: ActionCard = {
  id: "q1z",
  canonicalId: "ci_q1z",
  reprints: ["set12-130"],
  cardType: "action",
  name: "Firefly Swarm",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_cf31223643444ceab69c0a9fddd46f22",
  },
  text: [
    {
      title: "Choose one:",
    },
    {
      title: "• Banish chosen character with 2 {S} or less.",
    },
    {
      title:
        "• If 2 or more other cards were put into your discard this turn, banish chosen character.",
    },
  ],
  abilities: [
    {
      type: "action",
      text: "Choose one: Banish chosen character with 2 {S} or less. If 2 or more other cards were put into your discard this turn, banish chosen character.",
      effect: {
        type: "choice",
        optionLabels: [
          "Banish chosen character with 2 {S} or less",
          "If 2 or more other cards were put into your discard this turn, banish chosen character",
        ],
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less-or-equal",
                  value: 2,
                },
              ],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "turn-metric",
              metric: "discard-cards-entered",
              ownerScope: "you",
              excludeSource: true,
              comparison: {
                operator: "gte",
                value: 2,
              },
            },
            then: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      },
    },
  ],
  i18n: fireflySwarmI18n,
};
