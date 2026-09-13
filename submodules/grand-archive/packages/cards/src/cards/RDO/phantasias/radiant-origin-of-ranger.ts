import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfRanger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tp7eVOsAHU",
  slug: "radiant-origin-of-ranger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tp7eVOsAHU:face:default",
      catalogId: "tp7eVOsAHU",
      name: "Radiant Origin of Ranger",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever a Ranger unit you control becomes distant, put a training counter on Radiant Origin of Ranger.\n\n[Class Bonus] (3), Sacrifice Radiant Origin of Ranger: Level up your champion. Activate this ability only if there are six or more training counters on Radiant Origin of Ranger.",
      abilities: [
        {
          id: "tp7eVOsAHU-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "tp7eVOsAHU-a2",
          kind: "triggered",
          text: "Whenever a Ranger unit you control becomes distant, put a training counter on Radiant Origin of Ranger.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
              },
              state: "distant",
              to: true,
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
          id: "tp7eVOsAHU-a3",
          kind: "activated",
          text: "[Class Bonus] (3), Sacrifice Radiant Origin of Ranger: Level up your champion. Activate this ability only if there are six or more training counters on Radiant Origin of Ranger.",
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

export default radiantOriginOfRanger;
