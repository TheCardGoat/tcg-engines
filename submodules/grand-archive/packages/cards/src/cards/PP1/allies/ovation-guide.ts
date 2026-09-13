import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ovationGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "R4IZe3rh4V",
  slug: "ovation-guide",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "R4IZe3rh4V:face:default",
      catalogId: "R4IZe3rh4V",
      name: "Ovation Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Target opponent may materialize a champion card from their material deck. If they do, you draw a card and gain the Crowd's Favor status.",
      abilities: [
        {
          id: "R4IZe3rh4V-a1",
          kind: "triggered",
          text: "On Enter: Target opponent may materialize a champion card from their material deck. If they do, you draw a card and gain the Crowd's Favor status.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "optional",
            player: {
              binding: "target-opponent",
            },
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-champion-card",
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
                  zones: ["material-deck"],
                  relationship: "zone-of",
                  player: {
                    binding: "target-opponent",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "attempt",
                    bindSucceededAs: "champion-materialized",
                    effect: {
                      kind: "materialize-card",
                      subject: {
                        kind: "bound",
                        binding: "chosen-champion-card",
                      },
                      materializer: {
                        binding: "target-opponent",
                      },
                      payCosts: true,
                    },
                  },
                  {
                    kind: "conditional",
                    condition: {
                      kind: "effect-succeeded",
                      binding: "champion-materialized",
                    },
                    then: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "draw",
                          player: "controller",
                          amount: 1,
                        },
                        {
                          kind: "set-player-state",
                          player: "controller",
                          state: {
                            named: "crowds-favor",
                          },
                          value: true,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default ovationGuide;
