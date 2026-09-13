import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunJianWolvesbane: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b23a85z88j",
  slug: "sun-jian-wolvesbane",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b23a85z88j:face:default",
      catalogId: "b23a85z88j",
      name: "Sun Jian, Wolvesbane",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "As long as Sun Jian is attacking a Beast unit, Sun Jian gets +2 POWER and her attacks can't be retaliated.\n\nOn Ally Kill: If the killed ally was a Beast, draw a card into your memory.",
      abilities: [
        {
          id: "b23a85z88j-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Sun Jian is attacking a Beast unit, Sun Jian gets +2 POWER and her attacks can't be retaliated.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              against: {
                kind: "source",
              },
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "b23a85z88j-a2",
          kind: "triggered",
          text: "On Ally Kill: If the killed ally was a Beast, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "event-recipient",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["BEAST"],
                  },
                ],
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default sunJianWolvesbane;
