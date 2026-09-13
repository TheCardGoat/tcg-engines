import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ignisDeus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rxdon8uwza",
  slug: "ignis-deus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rxdon8uwza:face:default",
      catalogId: "rxdon8uwza",
      name: "Ignis Deus",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if your champion is a Spirit.\n\nMaterialize a champion card with base level 1 from your material deck. If you do, for the rest of the game, non-Spirit champions you control can't level up.",
      abilities: [
        {
          id: "rxdon8uwza-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if your champion is a Spirit.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "subject-matches",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                filter: {
                  kind: "class",
                  oneOf: ["SPIRIT"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rxdon8uwza-a2",
          kind: "card-resolution",
          text: "Materialize a champion card with base level 1 from your material deck. If you do, for the rest of the game, non-Spirit champions you control can't level up.",
          effect: {
            kind: "choose",
            selection: {
              id: "champion-card",
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
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "level",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 1,
                      },
                    },
                  ],
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
                      binding: "champion-card",
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
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "level-up",
                    subject: {
                      kind: "player",
                      player: "controller",
                    },
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "subtype",
                            oneOf: ["SPIRIT"],
                          },
                        },
                      ],
                    },
                    duration: {
                      kind: "permanent",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default ignisDeus;
