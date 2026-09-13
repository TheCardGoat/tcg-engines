import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const horticounter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vve1szpv86",
  slug: "horticounter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vve1szpv86:face:default",
      catalogId: "vve1szpv86",
      name: "Horticounter",
      cost: {
        kind: "reserve",
        amount: {
          kind: "variable",
          symbol: "X",
        },
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice Y Herbs.\n\nNegate target card activation unless its controller pays (X+Y). Banish the card that had its activation negated this way. When an activation is negated this way, glimpse 3.",
      abilities: [
        {
          id: "vve1szpv86-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice Y Herbs.",
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
                  amount: {
                    kind: "variable",
                    symbol: "Y",
                  },
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "subtype",
                  oneOf: ["HERB"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vve1szpv86-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (X+Y). Banish the card that had its activation negated this way. When an activation is negated this way, glimpse 3.",
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
          variables: [
            {
              symbol: "Y",
              kind: "chosen",
              minimum: 0,
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      {
                        kind: "variable",
                        symbol: "X",
                      },
                      {
                        kind: "variable",
                        symbol: "Y",
                      },
                    ],
                  },
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
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "binding-count",
                      binding: "negated-stack-item",
                    },
                    operator: "gt",
                    right: 0,
                  },
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "banish-object",
                      subject: {
                        kind: "stack-source",
                        binding: "negated-stack-item",
                      },
                    },
                    {
                      kind: "keyword-action",
                      action: "glimpse",
                      amount: 3,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default horticounter;
