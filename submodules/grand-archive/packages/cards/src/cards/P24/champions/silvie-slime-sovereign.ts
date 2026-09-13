import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvieSlimeSovereign: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mdwbkuhtjm",
  slug: "silvie-slime-sovereign",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mdwbkuhtjm:face:default",
      catalogId: "mdwbkuhtjm",
      name: "Silvie, Slime Sovereign",
      lineageName: "Silvie",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Silvie Lineage\n\nOn Enter: The next Slime ally card you activate this turn costs 2 less to activate and enters the field with two additional buff counters on it.\n\nIgnore the elemental requirements of advanced element Slime cards you activate.",
      abilities: [
        {
          id: "mdwbkuhtjm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Silvie Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Silvie",
          },
        },
        {
          id: "mdwbkuhtjm-a2",
          kind: "triggered",
          text: "On Enter: The next Slime ally card you activate this turn costs 2 less to activate and enters the field with two additional buff counters on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
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
                      oneOf: ["SLIME"],
                    },
                  ],
                },
                costKind: "reserve",
                costOperation: "subtract",
                amount: 2,
                duration: {
                  kind: "for-next-event",
                  event: "card-activated",
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "object-entered-field",
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
                          kind: "subtype",
                          oneOf: ["SLIME"],
                        },
                      ],
                    },
                  },
                  cause: {
                    kind: "card-activation",
                    controller: "controller",
                  },
                },
                operation: {
                  kind: "add-object-counters",
                  counters: [
                    {
                      counter: "buff",
                      amount: 2,
                    },
                  ],
                },
                duration: {
                  kind: "for-next-event",
                  event: "object-entered-field",
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
        {
          id: "mdwbkuhtjm-a3",
          kind: "static",
          staticKind: "effects",
          text: "Ignore the elemental requirements of advanced element Slime cards you activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element-category",
                    value: "advanced",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["SLIME"],
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default silvieSlimeSovereign;
