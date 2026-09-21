import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dianaMoonpiercer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v3vfjtwm7g",
  slug: "diana-moonpiercer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v3vfjtwm7g:face:default",
      catalogId: "v3vfjtwm7g",
      name: "Diana, Moonpiercer",
      lineageName: "Diana",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Diana Lineage\n\nWhenever Diana becomes distant, choose one—\n• Negate each card activation that targets Diana unless its controller pays (2). Then if Diana is defending, end the combat phase unless the attacking player pays (2).\n• Glimpse 2.\n",
      abilities: [
        {
          id: "v3vfjtwm7g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Diana Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Diana",
          },
        },
        {
          id: "v3vfjtwm7g-a2",
          kind: "triggered",
          text: "Whenever Diana becomes distant, choose one—\n• Negate each card activation that targets Diana unless its controller pays (2). Then if Diana is defending, end the combat phase unless the attacking player pays (2).\n• Glimpse 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "distant",
              to: true,
            },
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "negate-targeting-activations",
                text: "Negate each card activation that targets Diana unless its controller pays (2). Then if Diana is defending, end the combat phase unless the attacking player pays (2).",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "choose",
                      selection: {
                        id: "targeting-activations",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "stack-item",
                          itemTypes: ["card-activation"],
                          targeting: {
                            subject: {
                              kind: "source",
                            },
                          },
                        },
                      },
                      effect: {
                        kind: "for-each",
                        collection: {
                          kind: "stack-items",
                          binding: "targeting-activations",
                        },
                        bindEachAs: "targeting-activation",
                        effect: {
                          kind: "unless-paid",
                          player: {
                            controllerOf: "targeting-activation",
                          },
                          cost: {
                            kind: "pay-reserve",
                            amount: 2,
                          },
                          otherwise: {
                            kind: "negate",
                            subject: {
                              kind: "bound",
                              binding: "targeting-activation",
                            },
                          },
                        },
                      },
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "object-state",
                        subject: {
                          kind: "source",
                        },
                        state: "defending",
                      },
                      then: {
                        kind: "unless-paid",
                        player: "attacking-player",
                        cost: {
                          kind: "pay-reserve",
                          amount: 2,
                        },
                        otherwise: {
                          kind: "end-phase",
                          phase: "combat",
                        },
                      },
                    },
                  ],
                },
              },
              {
                id: "glimpse",
                text: "Glimpse 2.",
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  player: "controller",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dianaMoonpiercer;
