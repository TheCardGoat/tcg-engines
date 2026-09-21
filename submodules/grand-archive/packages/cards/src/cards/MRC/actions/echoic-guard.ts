import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const echoicGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gn1b2sbrq9",
  slug: "echoic-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gn1b2sbrq9:face:default",
      catalogId: "gn1b2sbrq9",
      name: "Echoic Guard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nPrevent the next 2 damage that would be dealt to target ally this turn. Then you may pay (X) where X is that ally’s reserve cost. If you do, summon a token copy of that ally. ",
      abilities: [
        {
          id: "gn1b2sbrq9-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "gn1b2sbrq9-a2",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target ally this turn. Then you may pay (X) where X is that ally’s reserve cost. If you do, summon a token copy of that ally.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                property: "reserve-cost",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "bound-object",
                    binding: "target-1",
                  },
                },
                operation: {
                  kind: "prevent",
                },
                capacity: {
                  amount: 2,
                  scope: "replacement-instance",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "attempt",
                      effect: {
                        kind: "pay",
                        player: "controller",
                        cost: {
                          kind: "pay-reserve",
                          amount: {
                            kind: "variable",
                            symbol: "X",
                          },
                        },
                      },
                      bindSucceededAs: "optional-action-succeeded",
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "effect-succeeded",
                        binding: "optional-action-succeeded",
                      },
                      then: {
                        kind: "summon",
                        copyOf: {
                          kind: "bound",
                          binding: "target-1",
                        },
                        controller: "controller",
                        bindResultAs: "summoned-token",
                      },
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

export default echoicGuard;
