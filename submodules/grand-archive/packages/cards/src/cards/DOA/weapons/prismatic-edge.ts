import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismaticEdge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FxYwR2azTt",
  slug: "prismatic-edge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FxYwR2azTt:face:default",
      catalogId: "FxYwR2azTt",
      name: "Prismatic Edge",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Each player reveals all cards in their memory. If a fire element card was revealed, choose a unit and deal 3 damage to it. If a water element card was revealed, draw a card. If a wind element card was revealed, each opponent banishes a card at random from their memory.",
      abilities: [
        {
          id: "FxYwR2azTt-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Each player reveals all cards in their memory. If a fire element card was revealed, choose a unit and deal 3 damage to it. If a water element card was revealed, draw a card. If a wind element card was revealed, each opponent banishes a card at random from their memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "each-player",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "each-player",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "revealed-memory-cards",
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "chosen-unit",
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
                      relationship: "zone-of",
                      player: "each-player",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "chosen-unit",
                    },
                    amount: 3,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "revealed-memory-cards",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "revealed-memory-cards",
                    filter: {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  },
                },
                then: {
                  kind: "banish",
                  player: "each-opponent",
                  selection: {
                    id: "random-opponent-memory-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "each-opponent",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    method: "random",
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "each-opponent",
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

export default prismaticEdge;
