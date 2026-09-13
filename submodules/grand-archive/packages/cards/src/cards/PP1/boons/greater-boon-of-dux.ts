import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfDux: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VOgZPEyKt1",
  slug: "greater-boon-of-dux",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "VOgZPEyKt1:face:default",
      catalogId: "VOgZPEyKt1",
      name: "Greater Boon of Dux",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Ignore the elemental requirements of non-advanced element ally cards with foster you activate.\n\nWhenever an ally you control becomes fostered, put a training counter on Greater Boon of Dux.\n\nAs long as Greater Boon of Dux has two or more training counters on it, allies you control get +1POWER and have “On Enter: This ally becomes fostered.”",
      abilities: [
        {
          id: "VOgZPEyKt1-a1",
          kind: "static",
          staticKind: "effects",
          text: "Ignore the elemental requirements of non-advanced element ally cards with foster you activate.",
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
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "element-category",
                        value: "non-advanced",
                      },
                    ],
                  },
                  {
                    kind: "has-keyword",
                    keyword: "foster",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "VOgZPEyKt1-a2",
          kind: "triggered",
          text: "Whenever an ally you control becomes fostered, put a training counter on Greater Boon of Dux.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              state: "fostered",
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
          id: "VOgZPEyKt1-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Greater Boon of Dux has two or more training counters on it, allies you control get +1POWER and have “On Enter: This ally becomes fostered.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "training",
                },
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
                  right: 2,
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
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "training",
                },
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
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-ig3uxc-a1",
                  kind: "triggered",
                  text: "On Enter: This ally becomes fostered.",
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
                    kind: "set-object-state",
                    subject: {
                      kind: "ability-bearer",
                    },
                    state: "fostered",
                    value: true,
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

export default greaterBoonOfDux;
