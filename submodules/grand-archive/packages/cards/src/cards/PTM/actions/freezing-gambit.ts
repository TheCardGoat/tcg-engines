import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freezingGambit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fgBpQZe0js",
  slug: "freezing-gambit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fgBpQZe0js:face:default",
      catalogId: "fgBpQZe0js",
      name: "Freezing Gambit",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a Chessman ally.\n\nChoose one or both—\n• Negate target card activation unless its controller pays (2).\n• Target unit's attacks get -3 POWER until end of turn.",
      abilities: [
        {
          id: "fgBpQZe0js-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Chessman ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
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
          id: "fgBpQZe0js-a2",
          kind: "card-resolution",
          text: "Choose one or both—\n• Negate target card activation unless its controller pays (2).\n• Target unit's attacks get -3 POWER until end of turn.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "at-least",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Negate target card activation unless its controller pays (2).",
                targets: [
                  {
                    id: "target-stack-item",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "stack-item",
                      itemTypes: ["card-activation"],
                    },
                  },
                ],
                effect: {
                  kind: "unless-paid",
                  player: {
                    controllerOf: "target-stack-item",
                  },
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                  otherwise: {
                    kind: "negate",
                    subject: {
                      kind: "bound",
                      binding: "target-stack-item",
                    },
                    bindResultAs: "negated-stack-item",
                  },
                },
              },
              {
                id: "mode-2",
                text: "Target unit's attacks get -3 POWER until end of turn",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "bound-object",
                        binding: "target-1",
                      },
                    },
                  },
                  expires: {
                    kind: "this-turn",
                  },
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "current-attack",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-attack",
                    },
                    layer: {
                      layer: "E",
                      modifies: "stat",
                      sublayer: "modifier",
                    },
                    change: {
                      kind: "numeric",
                      property: "power",
                      operation: "subtract",
                      amount: 3,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default freezingGambit;
