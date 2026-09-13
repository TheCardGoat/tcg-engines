import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const regalInquisition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KVbuQJyWsU",
  slug: "regal-inquisition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KVbuQJyWsU:face:default",
      catalogId: "KVbuQJyWsU",
      name: "Regal Inquisition",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Look at target opponent's hand and memory. Discard any amount of cards from among them. For each card discarded this way, that opponent reveals the top card of their deck and puts it into their hand.",
      abilities: [
        {
          id: "KVbuQJyWsU-a1",
          kind: "card-resolution",
          text: "Look at target opponent's hand and memory. Discard any amount of cards from among them. For each card discarded this way, that opponent reveals the top card of their deck and puts it into their hand.",
          targets: [
            {
              id: "target-opponent",
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
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "discarded-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "union",
                    sources: [
                      {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: {
                          binding: "target-opponent",
                        },
                      },
                      {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: {
                          binding: "target-opponent",
                        },
                      },
                    ],
                  },
                },
              },
              {
                kind: "discard",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "discarded-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  unique: true,
                  candidates: {
                    kind: "union",
                    sources: [
                      {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: {
                          binding: "target-opponent",
                        },
                      },
                      {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: {
                          binding: "target-opponent",
                        },
                      },
                    ],
                  },
                },
                bindResultAs: "discarded-opponent-cards",
              },
              {
                kind: "repeat",
                count: {
                  kind: "modified-ability-result-amount",
                  metric: "cards-moved",
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: {
                        binding: "target-opponent",
                      },
                      selection: {
                        id: "replacement-draw",
                        kind: "choice",
                        declared: "resolution",
                        chooser: {
                          binding: "target-opponent",
                        },
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["main-deck"],
                          relationship: "zone-of",
                          player: {
                            binding: "target-opponent",
                          },
                          fromTop: true,
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "replacement-draw",
                      },
                      destination: {
                        zone: "hand",
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

export default regalInquisition;
