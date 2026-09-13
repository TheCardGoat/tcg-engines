import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dOPqsWYMCQ",
  slug: "radiant-origin-of-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dOPqsWYMCQ:face:default",
      catalogId: "dOPqsWYMCQ",
      name: "Radiant Origin of Mage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever you empower, put a training counter on Radiant Origin of Mage.\n\n[Class Bonus] (4), Sacrifice Radiant Origin of Mage: Level up your champion. Activate this ability only if there are six or more training counters on Radiant Origin of Mage.",
      abilities: [
        {
          id: "dOPqsWYMCQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "dOPqsWYMCQ-a2",
          kind: "triggered",
          text: "Whenever you empower, put a training counter on Radiant Origin of Mage.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "empower",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "training",
            },
            amount: 1,
          },
        },
        {
          id: "dOPqsWYMCQ-a3",
          kind: "activated",
          text: "[Class Bonus] (4), Sacrifice Radiant Origin of Mage: Level up your champion. Activate this ability only if there are six or more training counters on Radiant Origin of Mage.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "training",
                },
              },
              operator: "gte",
              right: 6,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "level-up",
            subject: {
              kind: "champion",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default radiantOriginOfMage;
