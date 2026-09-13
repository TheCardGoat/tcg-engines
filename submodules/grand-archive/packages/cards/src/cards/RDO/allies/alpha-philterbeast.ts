import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alphaPhilterbeast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NwK5wge8wy",
  slug: "alpha-philterbeast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NwK5wge8wy:face:default",
      catalogId: "NwK5wge8wy",
      name: "Alpha Philterbeast",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "BEAST", "GOLEM"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Brew — Three Herbs\n\nOn Enter: If Alpha Philterbeast was brewed, put two age counters on it.\n\nWhenever an opponent activates a card with reserve cost 3 or more, put an age counter on Alpha Philterbeast.\n\nAlpha Philterbeast gets +1POWER and +1LIFE for each age counter on it.",
      abilities: [
        {
          id: "NwK5wge8wy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Three Herbs",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 3,
              },
            ],
          },
        },
        {
          id: "NwK5wge8wy-a2",
          kind: "triggered",
          text: "On Enter: If Alpha Philterbeast was brewed, put two age counters on it.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "brewed",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "event-subject",
              },
              counter: {
                named: "age",
              },
              amount: 2,
            },
          },
        },
        {
          id: "NwK5wge8wy-a3",
          kind: "triggered",
          text: "Whenever an opponent activates a card with reserve cost 3 or more, put an age counter on Alpha Philterbeast.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "opponent",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "numeric",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "candidate",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                    operator: "eq",
                    right: 3,
                  },
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
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "NwK5wge8wy-a4",
          kind: "static",
          staticKind: "effects",
          text: "Alpha Philterbeast gets +1POWER and +1LIFE for each age counter on it.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "age",
                  },
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                property: "life",
                operation: "add",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "age",
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default alphaPhilterbeast;
