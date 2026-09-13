import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const topsyDecree: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Byx6iokcT4",
  slug: "topsy-decree",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Byx6iokcT4:face:default",
      catalogId: "Byx6iokcT4",
      name: "Topsy Decree",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 3\n\nChoose one. If Topsy Decree is imbued, choose two instead—\n• Your champion gains spellshroud until end of turn.\n• Up to one target opponent discards a card from their hand or memory.\n• Choose up to two cards from a single graveyard and banish them.",
      abilities: [
        {
          id: "Byx6iokcT4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "Byx6iokcT4-a2",
          kind: "card-resolution",
          text: "Choose one. If Topsy Decree is imbued, choose two instead—\n• Your champion gains spellshroud until end of turn.\n• Up to one target opponent discards a card from their hand or memory.\n• Choose up to two cards from a single graveyard and banish them.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "conditional",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                id: "spellshroud",
                text: "Your champion gains spellshroud until end of turn.",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "champion",
                    player: "controller",
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
                      name: "spellshroud",
                    },
                  },
                },
              },
              {
                id: "discard",
                text: "Up to one target opponent discards a card from their hand or memory.",
                targets: [
                  {
                    id: "discarding-opponent",
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
                      players: ["opponent"],
                    },
                  },
                ],
                effect: {
                  kind: "discard",
                  player: {
                    binding: "discarding-opponent",
                  },
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: {
                      binding: "discarding-opponent",
                    },
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["hand", "memory"],
                      relationship: "zone-of",
                      player: {
                        binding: "discarding-opponent",
                      },
                    },
                  },
                },
              },
              {
                id: "banish-graveyard",
                text: "Choose up to two cards from a single graveyard and banish them.",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "graveyard-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 2,
                    },
                    unique: true,
                    singleZoneOwner: true,
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      player: "each-player",
                    },
                  },
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "graveyard-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      unique: true,
                      singleZoneOwner: true,
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        player: "each-player",
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

export default topsyDecree;
