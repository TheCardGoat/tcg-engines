import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfTamer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zS0TJ97QSV",
  slug: "radiant-origin-of-tamer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zS0TJ97QSV:face:default",
      catalogId: "zS0TJ97QSV",
      name: "Radiant Origin of Tamer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever you declare an attack with a non-Human ally, put a training counter on Radiant Origin of Tamer.\n\n[Class Bonus] (3), Sacrifice Radiant Origin of Tamer: Level up your champion. Activate this ability only if there are seven or more training counters on Radiant Origin of Tamer.",
      abilities: [
        {
          id: "zS0TJ97QSV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "zS0TJ97QSV-a2",
          kind: "triggered",
          text: "Whenever you declare an attack with a non-Human ally, put a training counter on Radiant Origin of Tamer.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    },
                  ],
                },
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
          id: "zS0TJ97QSV-a3",
          kind: "activated",
          text: "[Class Bonus] (3), Sacrifice Radiant Origin of Tamer: Level up your champion. Activate this ability only if there are seven or more training counters on Radiant Origin of Tamer.",
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
              right: 7,
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

export default radiantOriginOfTamer;
