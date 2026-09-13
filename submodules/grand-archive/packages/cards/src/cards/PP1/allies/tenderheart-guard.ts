import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tenderheartGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0ZWcrEsFHA",
  slug: "tenderheart-guard",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "0ZWcrEsFHA:face:default",
      catalogId: "0ZWcrEsFHA",
      name: "Tenderheart Guard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Each player may discard a card. Each player that does draws a card into their memory. Then you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "0ZWcrEsFHA-a1",
          kind: "triggered",
          text: "On Enter: Each player may discard a card. Each player that does draws a card into their memory. Then you gain the Crowd's Favor status.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "for-each-player",
                players: "each-player",
                bindEachAs: "participating-player",
                effect: {
                  kind: "optional",
                  player: {
                    binding: "participating-player",
                  },
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "discard",
                        player: {
                          binding: "participating-player",
                        },
                        selection: {
                          id: "discarded-card",
                          kind: "choice",
                          declared: "resolution",
                          chooser: {
                            binding: "participating-player",
                          },
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          unique: true,
                          candidates: {
                            kind: "card",
                            zones: ["hand"],
                            relationship: "zone-of",
                            player: {
                              binding: "participating-player",
                            },
                          },
                        },
                      },
                      {
                        kind: "draw",
                        player: {
                          binding: "participating-player",
                        },
                        amount: 1,
                        to: "memory",
                      },
                    ],
                  },
                },
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "Crowd's Favor",
                },
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default tenderheartGuard;
