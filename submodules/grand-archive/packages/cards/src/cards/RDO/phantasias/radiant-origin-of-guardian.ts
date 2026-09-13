import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfGuardian: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yT32RI6pqt",
  slug: "radiant-origin-of-guardian",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yT32RI6pqt:face:default",
      catalogId: "yT32RI6pqt",
      name: "Radiant Origin of Guardian",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever a unit source you control deals 4 or more damage, put a training counter on Radiant Origin of Guardian.\n\n[Class Bonus] (3), Sacrifice Radiant Origin of Guardian: Level up your champion. Activate this ability only if there are five or more training counters on Radiant Origin of Guardian.",
      abilities: [
        {
          id: "yT32RI6pqt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "yT32RI6pqt-a2",
          kind: "triggered",
          text: "Whenever a unit source you control deals 4 or more damage, put a training counter on Radiant Origin of Guardian.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "gte",
                right: 4,
              },
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
          id: "yT32RI6pqt-a3",
          kind: "activated",
          text: "[Class Bonus] (3), Sacrifice Radiant Origin of Guardian: Level up your champion. Activate this ability only if there are five or more training counters on Radiant Origin of Guardian.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
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
              right: 5,
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

export default radiantOriginOfGuardian;
