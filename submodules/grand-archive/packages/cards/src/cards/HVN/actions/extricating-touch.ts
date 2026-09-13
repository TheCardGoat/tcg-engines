import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const extricatingTouch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4a8hl5dben",
  slug: "extricating-touch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4a8hl5dben:face:default",
      catalogId: "4a8hl5dben",
      name: "Extricating Touch",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n \nTarget player reveals your choice of their hand or memory. Choose a card from among the revealed cards and discard it.",
      abilities: [
        {
          id: "4a8hl5dben-a1",
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
          id: "4a8hl5dben-a2",
          kind: "card-resolution",
          text: "Target player reveals your choice of their hand or memory. Choose a card from among the revealed cards and discard it.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "hand",
                text: "Reveal their hand.",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: {
                        binding: "target-player",
                      },
                      selection: {
                        id: "revealed-hand",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        candidates: {
                          kind: "card",
                          zones: ["hand"],
                          relationship: "zone-of",
                          player: {
                            binding: "target-player",
                          },
                        },
                      },
                    },
                    {
                      kind: "discard",
                      player: {
                        binding: "target-player",
                      },
                      selection: {
                        id: "discarded-hand",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "revealed-hand",
                        },
                      },
                    },
                  ],
                },
              },
              {
                id: "memory",
                text: "Reveal their memory.",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: {
                        binding: "target-player",
                      },
                      selection: {
                        id: "revealed-memory",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: {
                            binding: "target-player",
                          },
                        },
                      },
                    },
                    {
                      kind: "discard",
                      player: {
                        binding: "target-player",
                      },
                      selection: {
                        id: "discarded-memory",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "revealed-memory",
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

export default extricatingTouch;
