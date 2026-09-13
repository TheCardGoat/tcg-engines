import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surgingObstruction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VpM6CAp4ts",
  slug: "surging-obstruction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VpM6CAp4ts:face:default",
      catalogId: "VpM6CAp4ts",
      name: "Surging Obstruction",
      cost: {
        kind: "reserve",
        amount: 3,
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
        "As long as you control a Chessman Bishop ally, this card costs 1 less to activate. \n\nNegate target card activation unless its controller pays (1). If that card has an odd reserve cost, negate its activation unless its controller pays (3) instead. (Zero is considered even.)",
      abilities: [
        {
          id: "VpM6CAp4ts-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a Chessman Bishop ally, this card costs 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BISHOP"],
                      },
                    ],
                  },
                },
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
          id: "VpM6CAp4ts-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (1). If that card has an odd reserve cost, negate its activation unless its controller pays (3) instead. (Zero is considered even.)",
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
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "stack-source",
                binding: "target-stack-item",
              },
              filter: {
                kind: "parity",
                property: "reserve-cost",
                value: "odd",
              },
            },
            then: {
              kind: "unless-paid",
              player: {
                controllerOf: "target-stack-item",
              },
              cost: {
                kind: "pay-reserve",
                amount: 3,
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
            else: {
              kind: "unless-paid",
              player: {
                controllerOf: "target-stack-item",
              },
              cost: {
                kind: "pay-reserve",
                amount: 1,
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
        },
      ],
    },
  },
};

export default surgingObstruction;
