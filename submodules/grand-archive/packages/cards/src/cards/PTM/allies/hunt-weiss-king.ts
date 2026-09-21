import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const huntWeissKing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Y6PZntlVDl",
  slug: "hunt-weiss-king",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Y6PZntlVDl:face:default",
      catalogId: "Y6PZntlVDl",
      name: "Hunt, Weiss King",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "KING", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "[Alice Bonus] This card costs 2 less to activate for each of up to two Pawn allies you control.\n\nREST: Choose one that hasn't been chosen—\n• If you control a Chessman Bishop ally, draw a card.\n• Put a buff counter on a Chessman Knight ally.\n• Change the target of an attack to a Chessman Rook ally you control. If you do, that ally gets +2 LIFE until end of turn.",
      abilities: [
        {
          id: "Y6PZntlVDl-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] This card costs 2 less to activate for each of up to two Pawn allies you control.",
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
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "calculate",
                    operator: "minimum",
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
                                kind: "subtype",
                                oneOf: ["PAWN"],
                              },
                            ],
                          },
                        },
                      },
                      2,
                    ],
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
          id: "Y6PZntlVDl-a2",
          kind: "activated",
          text: "REST: Choose one that hasn't been chosen—\n• If you control a Chessman Bishop ally, draw a card.\n• Put a buff counter on a Chessman Knight ally.\n• Change the target of an attack to a Chessman Rook ally you control. If you do, that ally gets +2 LIFE until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            excludePreviouslyChosen: true,
            trackChosenAs: "chosen-modes",
            modes: [
              {
                id: "mode-1",
                text: "If you control a Chessman Bishop ally, draw a card.",
                effect: {
                  kind: "conditional",
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
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              },
              {
                id: "mode-2",
                text: "Put a buff counter on a Chessman Knight ally.",
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
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "mode-3",
                text: "Change the target of an attack to a Chessman Rook ally you control. If you do, that ally gets +2 LIFE until end of turn",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "attempt",
                      effect: {
                        kind: "choose",
                        selection: {
                          id: "target-1",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          candidates: {
                            kind: "object",
                            zones: ["field"],
                            relationship: "controlled-by",
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
                                  oneOf: ["ROOK"],
                                },
                              ],
                            },
                          },
                        },
                        effect: {
                          kind: "retarget",
                          subject: {
                            kind: "current-attack",
                          },
                          chooser: "controller",
                          newTarget: {
                            kind: "bound",
                            binding: "target-1",
                          },
                        },
                      },
                      bindSucceededAs: "prior-effect-succeeded",
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "effect-succeeded",
                        binding: "prior-effect-succeeded",
                      },
                      then: {
                        kind: "continuous",
                        subjects: {
                          kind: "event-subject",
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
                          amount: 2,
                        },
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

export default huntWeissKing;
