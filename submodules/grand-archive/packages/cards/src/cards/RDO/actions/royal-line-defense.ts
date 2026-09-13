import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const royalLineDefense: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9urNxU7SZw",
  slug: "royal-line-defense",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9urNxU7SZw:face:default",
      catalogId: "9urNxU7SZw",
      name: "Royal Line Defense",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Alice Bonus] As long as you've activated a Command card this turn, this card costs 2 less to activate.\n\nChoose one—\n• Target Chessman ally gets +3LIFE until end of turn.\n• Negate target card activation if a Chessman ally is attacking.",
      abilities: [
        {
          id: "9urNxU7SZw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as you've activated a Command card this turn, this card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
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
              condition: {
                kind: "history",
                event: "card-activated",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["COMMAND"],
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "9urNxU7SZw-a2",
          kind: "card-resolution",
          text: "Choose one—\n• Target Chessman ally gets +3LIFE until end of turn.\n• Negate target card activation if a Chessman ally is attacking.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Target Chessman ally gets +3LIFE until end of turn.",
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
                ],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
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
                    amount: 3,
                  },
                },
              },
              {
                id: "mode-2",
                text: "Negate target card activation if a Chessman ally is attacking",
                targets: [
                  {
                    id: "target-card-activation",
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
                    kind: "combat-relation",
                    relation: "attacking",
                    subject: {
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
                              kind: "subtype",
                              oneOf: ["CHESSMAN"],
                            },
                          ],
                        },
                      },
                    },
                  },
                  then: {
                    kind: "negate",
                    subject: {
                      kind: "bound",
                      binding: "target-card-activation",
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

export default royalLineDefense;
