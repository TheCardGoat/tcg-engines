import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cometaryVantage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y4c89re0bd",
  slug: "cometary-vantage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y4c89re0bd:face:default",
      catalogId: "y4c89re0bd",
      name: "Cometary Vantage",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        'Choose one. If your champion is distant, choose two instead—\n• Glimpse 4.\n• Draw a card.\n• If a unit is attacking, each Aethercharge card in that attacker\'s intent gains "On Hit: Load this card into an Aetherwing weapon you control."',
      abilities: [
        {
          id: "y4c89re0bd-a1",
          kind: "card-resolution",
          text: 'Choose one. If your champion is distant, choose two instead—\n• Glimpse 4.\n• Draw a card.\n• If a unit is attacking, each Aethercharge card in that attacker\'s intent gains "On Hit: Load this card into an Aetherwing weapon you control."',
          effect: {
            kind: "select-modes",
            choose: {
              kind: "conditional",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
              },
              then: {
                kind: "exactly",
                amount: 2,
              },
              else: {
                kind: "exactly",
                amount: 1,
              },
            },
            modes: [
              {
                id: "glimpse",
                text: "Glimpse 4.",
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  player: "controller",
                  amount: 4,
                },
              },
              {
                id: "draw",
                text: "Draw a card.",
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                id: "grant-on-hit",
                text: "If a unit is attacking, each Aethercharge card in that attacker's intent gains an on-hit loading ability.",
                effect: {
                  kind: "conditional",
                  condition: {
                    kind: "collection-exists",
                    collection: {
                      zones: ["field"],
                      player: "each-player",
                      filter: {
                        kind: "object-state",
                        state: "attacking",
                      },
                    },
                  },
                  then: {
                    kind: "continuous",
                    subjects: {
                      kind: "each",
                      collection: {
                        zones: ["intent"],
                        host: {
                          kind: "current-attack",
                        },
                        relationship: "intent-of",
                        filter: {
                          kind: "subtype",
                          oneOf: ["AETHERCHARGE"],
                        },
                      },
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "permanent",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "grant-ability",
                      ability: {
                        id: "granted-ox12m3-a1",
                        kind: "triggered",
                        text: "On Hit: Load this card into an Aetherwing weapon you control.",
                        trigger: {
                          kind: "event",
                          event: {
                            name: "attack-hit",
                            subject: {
                              kind: "ability-bearer",
                            },
                          },
                        },
                        effect: {
                          kind: "choose",
                          selection: {
                            id: "aetherwing-weapon",
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
                                    oneOf: ["WEAPON"],
                                  },
                                  {
                                    kind: "subtype",
                                    oneOf: ["AETHERWING"],
                                  },
                                ],
                              },
                            },
                          },
                          effect: {
                            kind: "move",
                            subject: {
                              kind: "ability-bearer",
                            },
                            destination: {
                              zone: "loaded",
                              host: {
                                kind: "bound",
                                binding: "aetherwing-weapon",
                              },
                            },
                          },
                        },
                      },
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

export default cometaryVantage;
