import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mortalAmbition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ymuarq5tv0",
  slug: "mortal-ambition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ymuarq5tv0:face:default",
      catalogId: "ymuarq5tv0",
      name: "Mortal Ambition",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate for each unique ally you control.\n\nUntil end of turn, Human and Horse allies you control get +1 LIFE and gain ambush and steadfast.",
      abilities: [
        {
          id: "ymuarq5tv0-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate for each unique ally you control.",
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
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
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
                            kind: "supertype",
                            oneOf: ["UNIQUE"],
                          },
                        ],
                      },
                    },
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ymuarq5tv0-a2",
          kind: "card-resolution",
          text: "Until end of turn, Human and Horse allies you control get +1 LIFE and gain ambush and steadfast.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
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
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["HUMAN"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["HORSE"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["HUMAN"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["HORSE"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "ambush",
                  },
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
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["HUMAN"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["HORSE"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "steadfast",
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

export default mortalAmbition;
