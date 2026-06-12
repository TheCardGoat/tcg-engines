import type { LocationCard } from "@tcg/lorcana-types";
import { owlIslandSecludedEntranceI18n } from "./102-owl-island-secluded-entrance.i18n";

export const owlIslandSecludedEntrance: LocationCard = {
  id: "nw9",
  canonicalId: "ci_nw9",
  reprints: ["set6-102"],
  cardType: "location",
  name: "Owl Island",
  version: "Secluded Entrance",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "006",
  cardNumber: 102,
  rarity: "rare",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_2f052175c77d4035b1e261bf1675aee8",
    tcgPlayer: 593034,
  },
  text: [
    {
      title: "TEAMWORK",
      description:
        "For each character you have here, you pay 1 {I} less for the first action you play each turn.",
    },
    {
      title: "LOTS TO LEARN",
      description: "Whenever you play a second action in a turn, gain 3 lore.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "and",
        conditions: [
          {
            type: "turn-metric",
            metric: "played-actions",
            comparison: {
              operator: "eq",
              value: 0,
            },
          },
          {
            type: "target-query",
            query: {
              selector: "all",
              owner: "you",
              zones: ["play"],
              cardType: "character",
              filters: [
                {
                  type: "same-location-as-source",
                },
              ],
            },
            comparison: {
              operator: "gte",
              value: 1,
            },
          },
        ],
      },
      effect: {
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        cardType: "action",
        type: "cost-reduction",
      },
      id: "y11-1",
      name: "TEAMWORK",
      text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.",
      type: "static",
    },
    {
      condition: {
        type: "turn-metric",
        metric: "played-actions",
        comparison: {
          operator: "eq",
          value: 2,
        },
      },
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "y11-2",
      name: "LOTS TO LEARN",
      text: "LOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: owlIslandSecludedEntranceI18n,
};
