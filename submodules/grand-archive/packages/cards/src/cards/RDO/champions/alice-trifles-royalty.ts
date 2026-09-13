import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aliceTriflesRoyalty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tzV8YfYdHg",
  slug: "alice-trifles-royalty",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tzV8YfYdHg:face:default",
      catalogId: "tzV8YfYdHg",
      name: "Alice, Trifle's Royalty",
      lineageName: "Alice",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "This card costs 1 less to materialize for each Chessman ally you control.\n\nAlice Lineage\n\nAt the beginning of your recollection phase, summon a Pawn Piece token. Then if you control three or more Chessman allies, draw a card into your memory.",
      abilities: [
        {
          id: "tzV8YfYdHg-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to materialize for each Chessman ally you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: {
                kind: "count",
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
                        oneOf: ["CHESSMAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "tzV8YfYdHg-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Alice Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Alice",
          },
        },
        {
          id: "tzV8YfYdHg-a3",
          kind: "triggered",
          text: "At the beginning of your recollection phase, summon a Pawn Piece token. Then if you control three or more Chessman allies, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Pawn Piece",
                controller: "controller",
                bindResultAs: "summoned-token",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
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
                              oneOf: ["CHESSMAN"],
                            },
                          ],
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default aliceTriflesRoyalty;
